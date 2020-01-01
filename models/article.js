const mongoose = require('mongoose');
const Article = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'publisher'
    },
    date:{
        type:Date,
        default:Date.now()
    },
    verified:{
        type:Boolean,
        default:false
    }
});

const article = mongoose.model('articles',Article);

module.exports = article;