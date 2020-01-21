const mongoose = require('mongoose');

const publisher = new mongoose.Schema({
    full_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    linkedInLink:{
        type:String,
        default:null
    },
    areaOfSpeciality:{
        type:String,
        default:null
    },
    articles:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'articles'
    }],
    isAdmin:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:false,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    image:{
        type:String,
    }
})

const newPublisher = mongoose.model('newPublisher',publisher);

module.exports = newPublisher;