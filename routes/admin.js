var express = require('express');
const { render } = require('../app');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();
var userhelper = require('../helpers/user-helpers')
/* GET users listing. */
var signupErr=null
var statuss=null

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

router.get('/', function(req, res, next) {
  console.log(req.session.adminLoggedIn);
  if (req.session.adminLoggedIn) {
    userHelpers.getAllUsers().then((user) => {
      res.render('admin/view-user', {admin: true,user});
    })
    console.log("here admin")
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/login',function(req,res){
 if(req.session.adminLoggedIn){
  res.redirect('/admin')
 }else{
  res.render('admin/login-admin',{noHeader:true, "loginError":req.session.adminLoginError})
  req.session.adminLoginError = null
 }
})
const credentials={
  email:"admin@gmail.com",
  password:"admin"
}

router.post('/login',function(req,res){
  if(req.body.email == credentials.email && req.body.password == credentials.password){
    console.log('admin logged in');
    req.session.adminLoggedIn = true;
    req.session.admin = req.body.email;
    console.log(req.session);
    res.redirect('/admin');
    console.log(req.session);
  }else{
    console.log("admin not logged in");
    req.session.adminLoginError="Invalid Username or Password"
    res.redirect('/admin')
  }
})
router.get('/', function (req, res, next) {
  userHelpers.getAllUsers().then((user) => {
    console.log(req.body);
    // console.log(user);
    res.render('admin/view-user', { admin: true, user })
  })

});
router.get('/add-user', function (req, res) {
  if(req.session.admin){
  res.render('admin/add-user', { admin: true,signupErr })
  signupErr=null
  }else{
    res.redirect('/admin/login')
  }
})
// router.post('/add-user', (req, res) => {
//   console.log(req.body);

//   userhelper.addUser(req.body, (result) => {
//     res.render("admin/add-user")
//   })
// })
router.post('/add-user', (req, res) => {
  console.log(req.body);

  userhelper.addUser(req.body).then((result) => {
    // res.render("admin/add-user")

    if(result.statuss){
        console.log('IIII')
        res.redirect('/admin/add-user')
        }else{
          
          signupErr="The email-Id already exists!!"
           console.log('OOOO')
        res.redirect('/admin/add-user')
       }
  })
})

// router.post('/signup',(req,res)=>{
//   console.log(req.body);

// logHelpers.doSignup(req.body).then((response)=>{
//    console.log(response)
//   if(response.statuss){
//     console.log('IIII')
//     res.redirect('/login')
//   }else{
    
//     signupErr="The email-Id already exists!!"
//     console.log('OOOO')
//       res.redirect('/signup')
//   }
// })
// })


router.get('/delete-user/:id', (req, res) => {
  let userId = req.params.id
  console.log(userId);
  userHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin')
  })
})
router.get('/edit-user/:id', async (req, res) => {
  if(req.session.admin){
  let user = await userHelpers.getUserDetails(req.params.id)
  res.render('admin/edit-user', { user,admin:true ,signupErr })
  signupErr=null
  }else{
          
   
  res.redirect('/admin')
  }
})
router.post('/edit-user/:id', (req, res) => {
  console.log(req.params.id)
  
  userHelpers.updateUser(req.params.id, req.body).then((response) => {
    if(response.statuss){
    res.redirect('/admin')
  }else{
    signupErr="The email-Id already exists!!"
    res.redirect(`/admin/edit-user/${req.params.id}`)
  }
  })
})
router.get('/adminlogout',(req,res)=>{
  console.log('aaa')
  req.session.admin=null
  req.session.adminLoggedIn = null
  req.session.adminLoginError=null
  // req.session.adminLoginError=null
  res.redirect('/admin/login')
})
module.exports = router;
