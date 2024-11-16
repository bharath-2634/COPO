const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const mappingSchema = new Schema({
    cono : {type:String},
    courseOutcome : {type : String},
    PO1 : {type : String},
    PO2 : {type : String},
    PO3 : {type : String},
    PO4 : {type : String},
    PO5 : {type : String},
    PO6 : {type : String},
    PO7 : {type : String},
    PO8 : {type : String},
    PO9 : {type : String},
    PO10 : {type: String},
    PO11 : {type : String},
    PO12 : {type : String},
})

const copoMapping = new Schema({
    userId : {type : String},
    batchId : {type : String},
    subjectName : {type:String},
    subjectCode : {type : String},
    subjectMapData : [mappingSchema]    
})

module.exports = mongoose.model("subjectsMapping",copoMapping);

