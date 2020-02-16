module.exports = {
    homepageController:(req,res,next)=>{
        res.render('home');
    },
    registerController:(req,res,next)=>{
        res.render('register');
    },
    loginController:(req,res,next)=>{
        res.render('login');
    },
    userDashboardController:(req,res,next)=>{
        res.render('userDashboard',{
            user: req.user
        })
    },
    articles:(req,res,next) =>{
        res.render('articles');
    }
}