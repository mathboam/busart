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
    },
    publshed:{
        type:Boolean,
        default:false,
    },
    category:{
        type:String,
        required:true
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment'
    },
    relatedImage:{
        type:String,
    }
});

// Define our index
Article.index({
    title: 'text',
    body:'text'
})

const article = mongoose.model('articles',Article);

module.exports = article;