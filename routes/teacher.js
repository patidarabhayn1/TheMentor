var express = require('express');
const Teacher = require('../models/teacher');
const bodyParser = require('body-parser')
var passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());

router.route('/profile')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyTeacher, (req, res, next) => {
  Teacher.findById(req.user._id)
  .then((teacher) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(teacher);
  })
});

router.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyTeacher, authenticate.verifyAdmin, (req, res, next) => {
  Teacher.find({})
  .then((teachers) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(teachers);
  }, (err) => next(err))
  .catch((err) => {
    next(err);
  })
});

router.route('/signup')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res, next) => {
  newTeacher = new Teacher({
    username: req.body.username,
    name: req.body.name,
    joiningDate: req.body.joiningDate,
    email: req.body.email
  });
  Teacher.register(newTeacher, req.body.password, (err, teacher) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      console.log(teacher);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Teacher Registration Successful!'});
    }
  })
});

router.route('/signup/admin')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyTeacher , authenticate.verifyAdmin, (req, res, next) => {
  newTeacher = new Teacher({
    username: req.body.username,
    name: req.body.name,
    joiningDate: req.body.joiningDate,
    email: req.body.email,
    isAdmin: true
  });
  Teacher.register(newTeacher, req.body.password, (err, teacher) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      console.log(teacher);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Teacher Registration Successful!'});
    }
  })
});

router.route('/login')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, passport.authenticate('teacherLocal'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'Teacher Login Successful!'});
});

module.exports = router;