var express = require('express');
const Student = require('../models/student');
const bodyParser = require('body-parser')
var passport = require('passport');
//const authenticateTeacher = require('../authenticateTeacher');
const authenticateStudent = require('../authenticateStudent');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/',  (req, res, next) => {
  Student.find({})
  .then((students) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(students);
  }, (err) => next(err))
  .catch((err) => {
    next(err);
  })
});

router.post('/signup', (req, res, next) => {
  newStudent = new Student({
    username: req.body.enroll,
    name: req.body.name,
    admissionDate: req.body.admissionDate,
    email: req.body.email,
    degree: req.body.degree,
    branch: req.body.branch
  });
  Student.register(newStudent, req.body.password, (err, student) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      console.log(student);
      next();
    }
  })
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'Login Successful!'});
});

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('Not Logged In!');
    err.status = 403;
    next(err);
  }
})
module.exports = router;