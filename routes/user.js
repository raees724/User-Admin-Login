var express = require('express');
var router = express.Router();
const logHelpers=require('../helpers/log-helpers')
/* GET home page. */
var signupErr=null
var statuss=null

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

router.get('/', function(req, res, next) {
  let user=req.session.user
  res.render('index', {user});
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
res.redirect('/')
  }else{
    res.render('user/login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
  }
})
router.get('/signup',(req,res)=>{
  res.render('user/signup',{signupErr})
  signupErr=null
})

router.post('/signup',(req,res)=>{
  console.log(req.body);

logHelpers.doSignup(req.body).then((response)=>{
   console.log(response)
  if(response.statuss){
    console.log('IIII')
    res.redirect('/login')
  }else{
    
    signupErr="The email-Id already exists!!"
    console.log('OOOO')
      res.redirect('/signup')
  }
})
})

router.post('/login',(req,res)=>{
  logHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr="Invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.loggedIn=null
  req.session.user=null
  res.redirect('/')
})
module.exports = router;
