var express = require('express');
const Student = require('../models/student');
const StudentBatch = require('../models/studentBatch');
const Mentoring = require('../models/mentoringRecord');
const bodyParser = require('body-parser')
var passport = require('passport');
var authenticate = require('../authenticate');
var uploadInternshipRouter = require('./uploadInternshipCertificate');
var uploadCourseRouter = require('./uploadCourseCertificate');
const cors = require('./cors');
const path = require('path');
const Result = require('../models/result');

var options = {
  root: path.join("./public/InternshipCertificate")
};

var options2 = {
  root: path.join("./public/CourseCertificate")
};

var router = express.Router();
router.use(bodyParser.json());

router.use('/internships', uploadInternshipRouter);
router.use('/courses', uploadCourseRouter);

router.route('/profile')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyStudent, (req, res, next) => {
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
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyTeacher, (req, res, next) => {
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

.put(cors.corsWithOptions, authenticate.verifyTeacher, authenticate.verifyMentor, (req, res, next) => {
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
});


router.route('/:studentId/result')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyTeacher,  (req, res, next) => {
    Result.find({enroll: req.params.studentId})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})


router.route('/:studentId/result/:resultId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyTeacher,  (req, res, next) => {
  Result.find({enroll: req.params.studentId,  _id: req.params.resultId})
  .then((result) => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(result);
  }, (err) => next(err))
  .catch((err) => {
      next(err);
  })
})

router.route('/:studentId/result/:resultId/subjects')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyStudent,  (req, res, next) => {
    Result.find({enroll: req.studentId, _id: req.params.resultId})
    .populate('subjects.course')
    .then((result) => {
        if(result.length > 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result[0].subjects);
        }
        else {
            var err =  new Error("No result exist with this Result Id");
            err.statusCode = 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

router.route('/:studentId/result/:resultId/subjects/:subjectId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyStudent,  (req, res, next) => {
    Result.find({enroll: req.studentId, _id: req.params.resultId})
    .populate('subjects.course')
    .then((result) => {
        if(result.length > 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result[0].subjects.id(req.params.subjectId));
        }
        else {
            var err =  new Error("No result exist with this Result Id");
            err.statusCode = 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})


router.route('/:studentId/internships/:internshipId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res, next) => {
    Student.findById(req.params.studentId)
    .then((student) => {
        if(student != null) {
            var record = student.internships.id(req.params.internshipId);
            if(record != null) {
                var filename = record.certificate;
                res.sendFile(filename,  options,  (err) => {
                    if(err){
                        next(err);
                    }
                    else {
                        console.log("Sent:", options.root , "\\" , filename);
                    }
                })
            }
            else {
                var err = new Error("No Internship Record");
                err.statusCode = 403;
                return next(err);
            }
        }
        else {
            var err = new Error("No student Exist");
            err.statusCode = 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        console.log(err);
        next(err);
    })
})

router.route('/:studentId/courses/:courseId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, (req, res, next) => {
    Student.findById(req.params.studentId)
    .then((student) => {
        if(student != null) {
            var record = student.courses.id(req.params.courseId);
            if(record != null) {
                var filename = record.certificate;
                res.sendFile(filename,  options2,  (err) => {
                    if(err){
                        next(err);
                    }
                    else {
                        console.log("Sent:", options.root2 , "\\" , filename);
                    }
                })
            }
            else {
                var err = new Error("No Course Record");
                err.statusCode = 403;
                return next(err);
            }
        }
        else {
            var err = new Error("No student Exist");
            err.statusCode = 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        console.log(err);
        next(err);
    })
})

router.route('/:studentId/absence')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyTeacher ,authenticate.verifyMentor, (req, res, next) => {
    Student.findById(req.params.studentId)
    .then((student) => {
        if(student != null){
          student.majorAbsence.push(req.body)
          student.save()
          .then((student) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(student);
          }, (err) => next(err))
        }
    })
});

router.route('/:studentId/absence/:absenceId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.delete(cors.corsWithOptions, authenticate.verifyTeacher ,authenticate.verifyMentor, (req, res, next) => {
    Student.findById(req.params.studentId)
    .then((student) => {
        if(student != null){
          student.majorAbsence.id(req.params.absenceId).remove()
          student.save()
          .then((student) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(student);
          }, (err) => next(err))
        }
    })
});

router.route('/:studentId/activity')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyTeacher ,authenticate.verifyMentor, (req, res, next) => {
    Student.findById(req.params.studentId)
    .then((student) => {
        if(student != null){
          student.disciplinary.push(req.body)
          student.save()
          .then((student) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(student);
          }, (err) => next(err))
        }
    })
});

router.route('/:studentId/activity/:activityId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.delete(cors.corsWithOptions, authenticate.verifyTeacher ,authenticate.verifyMentor, (req, res, next) => {
    Student.findById(req.params.studentId)
    .then((student) => {
        if(student != null){
          student.disciplinary.id(req.params.activityId).remove()
          student.save()
          .then((student) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(student);
          }, (err) => next(err))
        }
    })
});

router.route('/signup')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res, next) => {
  newStudent = new Student({
    username: req.body.username,
    name: req.body.name,
    admissionDate: req.body.admissionDate,
    email: req.body.email,
    degree : req.body.degree,
    branch: req.body.branch,
    phoneNumber: req.body.phoneNumber
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

router.route('/login')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, passport.authenticate('studentLocal'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'Student Login Successful!'});
});


module.exports = router;