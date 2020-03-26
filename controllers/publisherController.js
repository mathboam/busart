const Publisher = require('../models/publisher');
const Article = require('../models/article');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const multer = require('multer');
const path = require('path')


// set Storage engine
const storage = multer.diskStorage({
    destination:'./public/uploads/images/',
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

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
    limits:{fileSize: 1 * 1000 * 1000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb)
    },
}).single('image');



// send grid configuration
var options = {
    auth: {
    api_user: 'Mathias123',
    api_key: 'BoAMPONGBiG11'
    }
}

var client = nodemailer.createTransport(sgTransport(options));



module.exports={

    saveImage: (req,res,next)=>{
        upload(req,res,(err) =>{
            if(err) {
                req.flash('error_msg',err);
                res.redirect('/register');
            }else{
                console.log(req.file);
                next();
            }
        });

    },

    addPublisher:  async (req,res) => {
        const {full_name , email, linkedInLink , password , password2,gender} = req.body;
        let errors = [];

        // check for required fields
        if (!full_name || !email || !linkedInLink || !password || !password2 || !gender) {
            errors.push({msg:'please fill in all fields'});
        }

        // check if passwords match
        if (password !==  password2) {
            errors.push({msg:'passwords do not match'});
        }

        // check password length
        if (password && password.length < 6) {
            errors.push({msg:'password is not strong'});
        }
        // check if there is any error 
        if (errors.length > 0) {
            res.render('register',{
                errors,
                full_name,
                email,
                linkedInLink,
                password,
                gender,
                image,
                password2
            })
        }else{
            // passed validation 
          const user = await Publisher.findOne({ email: email})
            if (user) {
                errors.push({msg:'Email is already registered..want login? ... click login'});
                    res.render('register',{
                        errors,
                        full_name,
                        email,
                        linkedInLink,
                        password,
                        password2
                    });
        }else{

        const image = req.file.path;
            
        const publisher = new Publisher({
            full_name,
            email,
            linkedInLink,
            password,
            gender,  
            image
        })
            

            // hash publisher's password
             bcrypt.genSalt(10,(err,salt)=> bcrypt.hash(publisher.password,salt, async (err,hash)=>{
            // if (err) throw err;
           


            // set password to hashed password
            publisher.password = hash;

            var email = {
                from: 'busart@gmail.com',
                to: publisher.email,
                subject: 'Activation Link',
                text: 'Hello world',
                html: `<h1> Welcome, <strong> ${publisher.full_name} </strong><h1
                    <h2>Click the button below to activate your email on Busuart</h2>
                    <a href="http://localhost:5000/activate/${publisher.id}">Verify account</a>
                `
            };
            
            client.sendMail(email, async (err, info)=>{
                if (err ){
                    console.log(err);
                    req.flash('error_msg','mail could not be sent, please try again later');
                    res.redirect('/register');
                }
                else {
                    // save publisher
                    await publisher.save();
                    req.flash('success_msg','A mail has been sent to your email check it out to verify your account');
                    res.redirect('/register');
                    console.log('Message sent: ' + info.response);
                }
            });
 
        }))
        
    }
}
    },

    getUsers:async(req,res,next)=>{
        const users = await Publisher.find();
        res.json(users);
    },

    deleteUser:async(req,res,next)=>{
        const {userId} = req.params;

        await Publisher.findByIdAndDelete(userId,(err)=>{
            // if (err){
            //     throw err;
            // }
        res.status(200).json({message:'deleted user'});
        })
        next();
    },
    // login handle
    login:async(req,res,next)=>{

        const user = await Publisher.findOne({'email':req.body.email});
        if ( typeof user !== undefined) {
            if (user.active === true) {
                passport.authenticate('local',{
                    successRedirect:'/userDashboard',
                    failureRedirect:'/login',
                    failureFlash:true
                })(req,res,next)
            }else{
                req.flash('error_msg','Your email is not verified, please check your mail to verify your account');
                res.redirect('/login');
            } 
        }else{

        }
       
       
    },
    logoutController:(req,res)=>{
        req.logout();
        req.flash('success_msg','You are logged out');
        res.redirect('/');
    },
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','please log in to view this resource');
        res.redirect('/login');
    },
    activate:async(req,res,next)=>{
        const { userId } = req.params;
        await Publisher.findByIdAndUpdate(userId,{active:true},(err) =>{
            if (err) {
                console.log(err);
                
            }else{
                // next();
                req.flash('success_msg','Your account is active, you can log in now');
                res.redirect('/login');
            }
        });
    
    },
    
    delete:async(req,res,next)=>{
        const users = await Publisher.find();
        if (users)
        users.forEach(async(user)=>{
            await user.remove();
        })
        console.log(users);
        
        res.send('pass');
    },

    // handle readmore page
    readmore:async(req,res,next)=>{
        const { articleId } =  req.params;
        // console.log(articleId);
        
         await Article.findById(articleId,async(err,article)=>{
            if (err) {
                console.log(err);
            }else{
                // console.log(article);
                const authorId = article.author;
                console.log(authorId);
                
                const author = await Publisher.findById(authorId)
                // console.log(author);


                res.render('single',{article,author});
            }
        });
       
    },

    articles:async(req,res,next) =>{
        const userId = req.params.userid;
        const user = await Publisher.findById(userId)


        const userArticlesIds = user.articles;
        console.log(userArticlesIds);
        
        const userArticles = [];
        // console.log(userArticlesIds[0]);
        
        const info = [];

        if(userArticlesIds[0] === undefined){
            info.push({msg:"You dont have an article now..... Write your first article"});
        }else{
            userArticlesIds.forEach(async article =>{
                const fullart = await Article.findById(article);
                userArticles.push(fullart);
                // console.log(userArticles);
            })
        }

        res.render('articles',{userArticles,user,info});
    }
}
