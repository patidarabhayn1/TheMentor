var express = require('express');
const Student = require('../models/student');
const StudentBatch = require('../models/studentBatch');
const Mentoring = require('../models/mentoringRecord');
const bodyParser = require('body-parser')
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

router.route('/profile')
.get(authenticate.verifyStudent, (req, res, next) => {
  Student.findById(req.user._id)
  .then((student) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(student);
  }, (err) => next(err))
  .catch((err) => {
    next(err);
  })
});

router.route('/:studentId')
.get(authenticate.verifyTeacher, (req, res, next) => {
  Student.findById(req.params.studentId)
  .then((student) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(student);
  }, (err) => next(err))
  .catch((err) => {
    next(err);
  })
})

.put(authenticate.verifyTeacher, (req, res, next) => {
  Student.findById(req.params.studentId)
  .then((student) => {
      if(student != null) {
          StudentBatch.find({mentee: student._id})
          .then((record) => {
            if(record.length > 0){
              Mentoring.findById(record[0].batch)
              .then((batch) => {
                console.log(batch);
                if(batch != null) {
                  if(!batch.mentor.equals(req.user._id)){
                    var err = new Error('You are not authorised to update this student');
                    err.status= 403;
                    return next(err);
                  }
                  else{    
                    Student.findByIdAndUpdate(req.params.studentId, {
                        $set: req.body
                    }, {
                        new: true
                    })
                    .then((student) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(student);
                    }, (err) => next(err))
                    .catch((err) => {
                        next(err);
                    })
                }
                }
                else {
                  var err = new Error('Mentor Not Exist');
                  err.status= 403;
                  return next(err);
                }
              })
            }
            else {
              var err = new Error('No Mentor Record for this Student');
              err.status= 403;
              return next(err);
            }
          })
      }
      else {
          var err = new Error('Student does not exist');
          err.status= 403;
          return next(err);
      }
  })
  .catch((err) => {
    next(err);
  })
});

router.post('/signup', (req, res, next) => {
  newStudent = new Student({
    username: req.body.username,
    name: req.body.name,
    admisisonDate: req.body.admisisonDate,
    email: req.body.email,
    degree : req.body.degree,
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
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Student Registration Successful!'});
    }
  })
});

router.post('/login', passport.authenticate('studentLocal'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'Student Login Successful!'});
});

module.exports = router;