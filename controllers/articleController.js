const Article = require('../models/article');
const User = require('../models/publisher');
const multer = require('multer');
const path = require('path');

// set Storage engine
const storage = multer.diskStorage({
    destination:'./public/uploads/images/',
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// function to check file type
function checkFileType(file,cb){

    const filetypes = /jpg|jpeg|png|gif/

    // check extensions 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // check mimtype
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {

        return cb(null,true)

    }else{
        cb('Error:Images Only');
    }
}
// initialize upload
const upload = multer({
    storage:storage,
    limits:{fileSize:1 * 1000 * 1000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb)
    },
}).single('relatedImage');

module.exports = {

    saveImage: async (req,res,next)=>{
        upload(req,res,(err) =>{
            if(err) {
                const {userId} = req.params;
                // const user = User.findById(userId);
                req.flash('error_msg',err);
                res.redirect('/userDashboard/articles/'+userId);
            }else{
                console.log(req.file);
                next();
            }
        });

    },

    addArticle: async (req,res,next) => {
        const {title,body,verified,category} = req.body;

        const errors =[];

        if (!title || !body || !category) {
            errors.push({msg:"Fill all fields of the article"});
        }else{
            const { userId } =req.params;

            const user = await User.findById(userId);
    
    
             const relatedImage = req.file.path;

            
            
            const newArticle = new Article({
                title,
                body,
                verified,
                relatedImage,
                category
            });
            
            
            newArticle.author = user;
    
            await newArticle.save();
    
            user.articles.push(newArticle);
    
            await user.save();
    
            req.flash('success_msg','Article is saved successfully');
            res.redirect('/userDashboard/articles/'+userId);
        }
    },

    getAllVerifiedArtcles: async (req,res,next) => {
        const verifiedArticles = await Article.find({"verified" : true});
        // console.log(verifiedArticles);
        res.render('home', {verifiedArticles} );

        // res.send("pass");
        

        // const verifiedArticles = [];
        // articles.forEach(article =>{
        //     if (article.verified == true) {
        //         verifiedArticles.push(article);
        //     }
        // })
        // res.json(verifiedArticles);
        // next();
    },

    getUserArticles: async (req,res,next) => {
        const { userId } = req.params;
        const userposts = await User.findById(userId).populate('articles');

        res.json(userposts.articles);
    },

    updateArticle: async (req,res,next)=>{
        const { postId } = req.params;
        const updatedArticle = await Article.findByIdAndUpdate(postId,req.body,(err)=>{
                if (err) {
                    throw err;
                }
                res.status(200).json({message:'updated success'})
            })
        await updatedArticle.save();
    },
    deleteArticle: async (req,res,next)=>{
        const { postId } = req.params;
        await Article.findByIdAndDelete(postId);
        next();
    },
    getAllArtricles: async (req,res,next)=>{
        const allArticles = await Article.find();
        res.json(allArticles);
    },

    search: async (req,res) =>{
        // res.send(req.query);
        const articles = await Article.find({
            $text:{
                $search: req.query.q
            }
        });
        res.json(articles);
    }
    // readfile:
    
}


