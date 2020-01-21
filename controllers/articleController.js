const Article = require('../models/article');
const User = require('../models/publisher');
const multer = require('multer');


module.exports = {
    addArticle: async (req,res,next) => {
        const { userId } =req.params;

        const user = await User.findById(userId);

        const newArticle = new Article(req.body);

        newArticle.author = user;

        await newArticle.save();

        user.articles.push(newArticle);

        await user.save();

        req.flash('success_msg','Article is saved successfully');
        res.redirect('/userDashboard');
        // res.status(200).json({message:'saved successfully'});
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


