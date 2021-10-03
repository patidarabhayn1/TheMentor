var express = require('express');
const Student = require('../models/student');
const bodyParser = require('body-parser')
var passport = require('passport');

var router = express.Router();
router.use(bodyParser.json());


router.get('/',  (req, res, next) => {
  console.log("HELLO GET");
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

module.exports = router;