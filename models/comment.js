const mongoose = require('mongoose');


const commentSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    image:{
        type:String,
        required:true
    },
    commentText:{
        type:String,
        required:true
    }

})

const comment  = mongoose.model('comment',commentSchema)


module.exports = comment;