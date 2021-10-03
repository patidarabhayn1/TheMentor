var express = require('express');
const Course = require('../models/course');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

var courseRouter = express.Router();
courseRouter.use(bodyParser.json());

courseRouter.route('/')
.get((req, res, next) => {
  Course.findOne({})
  .then((courses) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(courses);
  }, (err) => next(err))
  .catch((err) => {
      next(err);
  })
})

.post(authenticate.verifyTeacher, authenticate.verifyAdmin, (req, res, next) => {
  Course.create(req.body)
  .then((course) => {
      console.log('Course Created ' + course);
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(course);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.put(authenticate.verifyTeacher, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation NOT supported on /courses');
})

.delete(authenticate.verifyTeacher, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation NOT supported on /courses');
});

courseRouter.route('/:courseId')

.get((req, res, next) => {
    Course.findById(req.params.courseId)
    .then((course) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(course);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.post(authenticate.verifyTeacher, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST Method Not Supported');
})

.put(authenticate.verifyTeacher, authenticate.verifyAdmin, (req, res, next) => {
    Course.findByIdAndUpdate(req.params.courseId, {
        $set: req.body
    }, {
        new: true
    })
    .then((course) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(course);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.delete(authenticate.verifyTeacher, authenticate.verifyAdmin, (req, res, next) => {
    Course.findByIdAndRemove(req.params.courseId)
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
});

module.exports = courseRouter;