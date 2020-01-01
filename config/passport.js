const mongoose = require('mongoose');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// load model
const Publisher = require('../models/publisher');

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField:'email'}, async (email,password,done)=>{
            // match user 
        const user = await Publisher.findOne({ email: email });
        if (!user) {
            return done(null,false,{message:'This email is not registered'});
        }
        
        // match password
        bcrypt.compare(password,user.password,(err,isMatch)=>{
            if (err) {
                throw err;
            }

            if(isMatch){
                return done(null,user,)
            }else{
                return done(null, false ,{message:'Passsword incorrect'});
            }
        })
        })
    );
    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser(async (id, done)=> {
        await Publisher.findById(id, (err, user)=> {
          done(err, user);
        });
      });
}