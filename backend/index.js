require('dotenv').config();

const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Batch = require("./models/batch.model");
const Sem = require("./models/sem.model");

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






app.listen(8000);

module.exports = app;
