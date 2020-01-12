const Publisher = require('../models/publisher');
const Article = require('../models/article');
const bcrypt = require('bcryptjs');
const passport = require('passport');

module.exports={
    addPublisher:  async (req,res,next) => {
        const {full_name , email, linkedInLink , password , password2} = req.body;
        let errors = [];

        // check for required fields
        if (!full_name || !email || !linkedInLink || !password || !password2 ) {
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
        const publisher = new Publisher({
            full_name,
            email,
            linkedInLink,
            password,})
            
            // hash publisher's password
             bcrypt.genSalt(10,(err,salt)=> bcrypt.hash(publisher.password,salt, async (err,hash)=>{
            // if (err) throw err;
           
            // set password to hashed password
            publisher.password = hash;

            // save publisher
            await publisher.save();
            req.flash('success_msg','You are successfully registered and can login');
            res.redirect('/login');
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
        passport.authenticate('local',{
            successRedirect:'/userDashboard',
            failureRedirect:'/login',
            failureFlash:true
        })(req,res,next)
    },
    logoutController:(req,res)=>{
        req.logout();
        req.flash('success_msg','You are logged out');
        res.redirect('/login');
    },
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','please log in to view this resource');
        res.redirect('/login');
    }
}
