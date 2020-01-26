const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts  = require('express-ejs-layouts');
const passport = require('passport');


require('dotenv').config({
    path:'./variables.env'
})

// passport configurations 
require('./config/passport')(passport);

const app = express();

// setting up public directory
app.use(express.static(__dirname + '/public'));


// ejs middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname,'views'));


// making use of body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// express Session 
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Global Vars 
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// making use of cors 
app.use(cors());


// bring in route 
app.use('/',require('./route'));






















mongoose.connect(process.env.DATABASE, {useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false} ,(err)=>{
    if (err) {
        throw err
    }
    console.log(`database connected at successfully`);
    
})


app.listen(process.env.PORT,(err)=>{
    if (err) {
        throw err
    }
    console.log(`server started at ${process.env.PORT}`);
})
