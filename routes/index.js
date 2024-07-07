var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require('./post')
const upload = require('./multer');
const passport = require('passport');
const localstrategy = require("passport-local");
const users = require('./users');
passport.use(new localstrategy(userModel.authenticate()));


router.get('/', function(req, res) {
  res.render('index');
});

router.get('/profile', isLoggedIn , async function(req, res) {
  const user = await userModel.findOne({ username : req.session.passport.user})
  .populate("post")
  res.render('profile', {user})
});

router.get('/add', function(req, res) {
  res.render('add');
});

router.post('/createpost', isLoggedIn ,upload.single("postimage") , async function(req, res, next) {
  const user = await userModel.findOne({ username : req.session.passport.user});
  const post = await postModel.create({
    user : user._id,
    title : req.body.title,
    description : req.body.description,
    image : req.file.filename
  })
  user.post.push(post._id);
  await user.save();
  res.redirect('/profile')
});

router.post('/fileupload', isLoggedIn , upload.single("image"), async function(req, res, next) {
  const user = await userModel.findOne({ username : req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile');
});

// signup page
router.get('/signup', function(req, res) {
  res.render('signup');
});

// register route 
router.post('/signup', function (req, res){
  const userdata = new userModel({
    fullname : req.body.fullname,
    username : req.body.username,
    email : req.body.email
    });
  userModel.register(userdata, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect('/profile');
    });
  });
});

// login page
router.get('/login', function(req, res) {
  res.render('login', {error : req.flash('error')});
});

// login route
router.post('/login', passport.authenticate("local", {
  successRedirect : "/profile",
  failureRedirect : "/login",
  failureFlash : true
}), 
function (req, res){}
)

// logout route
router.get('/logout', function(req, res, next){
  req.logout(function(err){
    if (err){ return next (err); }
    res.redirect('/login');
  })
})

// protection code
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/signup');
}

module.exports = router;







// router.get('/create', async function(req, res){
//   let userdata = await userModel.create({
//     username: "Rohithy",
//     nickname: "rohit",
//     description: "i like food and travel",
//     categories: ['adventure'],
//   });
//   res.send(userdata);
// });

// router.get('/find', async function(req, res){
//   var regex = new RegExp("^roHith$", 'i');
//   let user = await userModel.find({ username : regex});
//   res.send(user);
// })


// connect-flash - used for flashing warning // need session data to perform flash therefore we need session data before calling flash

// router.get('/failed', function(req, res){
//   req.flash("age", 22);
//   req.flash('name', 'rohit');
//   res.send('ban gya');
// })

// router.get('/check', function(req, res){
//   console.log(req.flash("age"), req.flash('name'));
//   res.send('check ur terminal')
// })


// cookies - stores data at frontend or browser

// router.get('/', function(req, res) {
//   res.cookie('age', 25)
//   res.render('index');
// });

// router.get('/read', function(req, res){
//   console.log(req.cookies.age);
//   res.send('check console')
// });

// router.get('/delete', function(req, res){
//   res.clearCookie('age');
//   res.send('check console')
// })

// Session - data saved on server side

// router.get('/', function(req, res) {
//   req.session.ban = true;
//   res.render('index');
// });

// router.get('/checkban', function(req, res) {
//   if (req.session.ban === true){  
//     res.send('you are banned');
//   }
//   else{
//     res.send('ban removed')
//   }
// });

// router.get('/removeban', function(req, res){
//   req.session.destroy(function(err){
//     if (err) throw (err);
//     res.send("ban removed");
//   })
// })


// MongoDB CRUD operation

// router.get('/create', async function(req, res) {
//   let CreatedUser = await userModel.create({
//     username: "rohx99",
//     age: 17,
//     name: "Rohit"
//   });
//   res.send(CreatedUser);
// });

// router.get('/create', async function(req, res){
//   let CreatedUser = await userModel.create({
//     username : "ravi22",
//     age : 23,
//     name : "Ravi"
//   });
//   res.send(CreatedUser);
// })

// router.get('/allusers', async function(req, res){
//   const allusers= await userModel.findOne({ username : "rohx99"});
//   res.send(allusers);
// })


