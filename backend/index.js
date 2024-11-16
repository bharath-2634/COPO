require('dotenv').config();

const config = require("./config.json");
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Batch = require("./models/batch.model");
const Sem = require("./models/sem.model");
const Subjects = require("./models/subjects.model");

const express = require('express');
const cors = require('cors');

const app = express();

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utilities");

app.use(express.json());

app.use(
    cors(
        {
            origin : "*"
        }
    )
);

app.get("/",(req,res)=> {
    res.json({data : "hello"});
});

app.post("/create-user",async (req,res)=>{
    const {fullName,email,password} = req.body;
    
    if(!fullName) {
        return res.status(200).json({error : true,message : "Full Name Required"});
    }

    if(!email) {
        return res.status(200).json({error : true,message : "email Address Required"});
    }

    if(!password) {
        return res.status(200).json({error : true,message : "password is Required"});
    }

    const isUser = await User.findOne({email : email});

    if(isUser) {
        return res.json({
            error : true,
            message : "User Already Exists",
        })
    }

    const user = new User({
        fullName,
        email,
        password
    });

    await user.save();

    const accessToken = jwt.sign({
        user
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : "36000m",
    });

    return res.json({
        error:false,
        user,
        accessToken,
        message : "Registration Successful"
    });
});

app.post("/login",async (req,res)=> {
    const {email,password} = req.body;

    if(!email) {
        return res.status(400).json({error:true,message:"Email is Required"});
    }

    if(!password) {
        return res.status(400).json({error:true,message:"Password is Required"});
    }

    const userInfo = await User.findOne({email : email});

    if(!userInfo) { 
        return res.status(400).json({message : "User Not Found"});
    }

    if(userInfo.email === email && userInfo.password === password) {
        const user = {user : userInfo};
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn :"36000m"
        });

        return res.json({
            error:false,
            message : "Login Successful",
            email,
            accessToken,
        });
    }else {
        return res.status(200).json({
            error:true,
            message:"Invalid Credentials",
        });
    }

});


app.get("/get-user",authenticateToken,async (req,res) => {

    const {user} = req.user;
    // console.log(user);
    const isUser = await User.findOne({_id : user._id});

    if(!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user : {
            fullName : isUser.fullName,
            email : isUser.email,
            password : isUser.password,
            createdOn : isUser.createdOn,
            "_id" :  isUser._id
        },
        message : ""
    });


});

app.post("/add-batch",authenticateToken,async (req,res)=> {
    const {batchName} = req.body;

    const { user  } = req.user;

    if(!batchName) {
        return res.status(400).json({
            error : true,
            message : "batchName is required"
        });
    }

    try {

        const batch = new Batch({
            batchName : batchName,
            userId : user._id
        });

        await batch.save();

        return res.json({
            error : false,
            note,
            message : "batach Added Successfully"
        });
        

    }catch(error) {
        return res.status(500).json({
            error : true,
            message : "Internal Server Error"
        });
    }
});

app.get("/get-all-batches",authenticateToken,async(req,res)=>{

    const {user} = req.user;

    try {
        const batches = await Batch.find({userId : user._id});
        return res.json({
            error : false,
            batches,
            message : "All Notes retrieved successfully"
        });
    }catch(error) {
        return res.status(500).json({
            error : true,
            message : "Internal Server Error"
        });
    }
});

app.post("/add-sem",authenticateToken,async(req,res)=>{
    
    const {batchId,semName,subjects} = req.body;
    const {user} = req.user;

    if(!batchId) {
        return res.status(400).json({
            error : true,
            message : "batchId is required"
        });
    }

    if(!semName) {
        return res.status(400).json({
            error : true,
            message : "semName is required"
        });
    }

    if(!subjects) {
        return res.status(400).json({
            error : true,
            message : "subjects is required"
        });
    }

    try {

        const sem = new Sem({
            userId : user._id,
            batchId : batchId,
            semName : semName,
            subjects : subjects
        });

        await sem.save();
        return res.json({
            error : false,
            note,
            message : "Semester Added Successfully"
        });
    }catch(error) {
        return res.status(500).json({
            error : true,
            message : "Internal Server Error"
        });
    }

});

// app.get("/get-sem/:batchId",authenticateToken,async (req,res)=>{
//     const batchId = req.params.batchId;
//     const { user } = req.user;
//     console.log("User id : ",authenticateToken);
//     try {
//         const batchData = await Sem.find({userId : user._id,batchId : batchId});
//         console.log("batch Data : "+batchData);
//         return res.json({
//             error : false,
//             batchData,
//             message : "All Notes retrieved successfully"
//         });
        
//     }catch(error) {
//         return res.status(500).json({
//             error : true,
//             message : "Internal Server Error"

//         });
//     }
// });

app.get("/getSem-data/:batchId",authenticateToken,async(req,res)=>{
    const batchId = req.params.batchId;
    
    const { user } = req.user;
    console.log("Authenticated user:", req.user);
    try {
        const batchData = await Sem.find({userId : user._id,batchId : batchId});
        console.log("batchData from server : "+batchData);
        
        if (!batchData || batchData.length === 0) {
            return res.status(404).json({
                error: true,
                message: "No data found for this batch ID"
            });
        }

        return res.json({
            error : false,
            batchData : batchData,
            message : "All batch Data recieved successfully"
        });


    }catch(error) {
        console.log("Server Error : "+error);
        return res.status(500).json({
            error : true,
            message : "Internal Server Error "
        });
    }
});


app.get("/get-allSubjects/:batchId",authenticateToken,async(req,res)=>{
    const batchId = req.params.batchId;
    const { user } = req.user;

    try {
        const subjectData = await Sem.find({userId : user._id,batchId : batchId});
        if(!subjectData || subjectData.length == 0) {
            return res.status(404).json({
                error: true,
                message: "No data found for this batch ID"
            });
        }

        return res.json({
            error : false,
            subjectData : subjectData,
            message : "All subject Data recieved successfully"
        });

    }catch(error) {
        console.log("Server Error : "+error);
        return res.status(500).json({
            error : true,
            message : "Internal Server Error "
        });
    }

})

app.post("/addSubjectMapping",authenticateToken,async(req,res)=>{
    const {user} = req.user;
    const {batchId,subjectName,subjectCode,subjectMapData} = req.body
    console.log("from server side copo mapping final  : "+batchId + " "+ subjectName + " "+subjectCode + " " + subjectMapData);

    try {

        if(!batchId) {
            return res.status(400).json({
                error : true,
                message : "batchId is required"
            });
        }
        if(!subjectName) {
            return res.status(400).json({
                error : true,
                message : "subject Name is required"
            });
        }
        if(!subjectCode) {
            return res.status(400).json({
                error : true,
                message : "subject code is required"
            });
        }
        if(!subjectMapData) {
            return res.status(400).json({
                error : true,
                message : "subject Mapping Data is required"
            });
        }

        const subjectMapping = new Subjects({
            userId  : user._id,
            batchId : batchId,
            subjectName : subjectName,
            subjectCode : subjectCode,
            subjectMapData : subjectMapData
        });

        await subjectMapping.save()

        return res.json({
            error : false,
            note,
            message : "Semester Added Successfully"
        });


    }catch(error) {
        return res.status(500).json({
            error : true,
            message : "Internal Server Error"
        });
    }
});

app.get("/getSubjectMapping/:batchId/:subjectCode/:subjectName",authenticateToken,async(req,res)=>{
    const {user} = req.user;
    const {batchId} = req.params.batchId;

    // const {subjectCode} = req.params.subjectCode;
    // const {subjectName} = req.params.subjectName;

    console.log("userId : "+user._id);
    console.log("batchId : "+batchId);
    console.log("batchId  : " +req.params.batchId);
    
    // if (!batchId || !subjectCode || !subjectName) {
    //     return res.status(400).json({ error: true, message: "Missing required parameters" }); 
    // }
    

    try {
        console.log("recieved batchId : "+batchId);
        // console.log("From server Side of Subject Mapping : "+user._id + " " + batchId + " "+ subjectCode + " "+subjectName);
        // const isUserFound = await Subjects.findOne({ userId: user._id });
        // if (!isUserFound) {
        //     console.log("User ID not matching");
        //     return res.status(404).json({ error: true, message: "User ID does not match" });
        // }

        // const isBatchFound = await Subjects.findOne({ userId: user._id, batchId : batchId });
        // if (!isBatchFound) {
        //     console.log("Batch ID not matching");
        //     return res.status(404).json({ error: true, message: "Batch ID does not match" });
        // }

        // const isSubjectCodeFound = await Subjects.findOne({ userId: user._id, batchId, subjectCode , subjectName });
        // if (!isSubjectCodeFound) {
        //     console.log("Subject Code not matching");
        //     return res.status(404).json({ error: true, message: "Subject Code does not match" });
        // }

        // if(!subjectMappingData || subjectMappingData.length==0) {
        //     return res.status(404).json({
        //         error: true,
        //         message: "No data found for this batch ID"
        //     });
        // }

        const subjectMappingData = await Subjects.find({userId : user._id,batchId : req.params.batchId,subjectCode : req.params.subjectCode, subjectName : req.params.subjectName});

        console.log("from server Side of Subject Mapping  : "+subjectMappingData);
        return res.json({
            error : false,
            subjectMappingData : subjectMappingData,
            message : "All subject Mapping Data recieved successfully"
        });


    }catch(error) {
        console.log("Error from getSubjectMapping " + error);
        return res.status(500).json({
            error : true,
            message : "Internal Server Error"
        });
    }
})






app.listen(8000);

module.exports = app;
