var express = require('express');
const Student = require('../models/student');
const bodyParser = require('body-parser')
var passport = require('passport');
var authenticate = require('../authenticate');

const Mentoring = require('../models/mentoringRecord');
const StudentBatch =require('../models/studentBatch');

var router = express.Router();
router.use(bodyParser.json());


//BATCHES GENERAL
router.route('/')
.get(authenticate.verifyTeacher, (req, res, next) => {
    Mentoring.find({mentor: req.user._id})
    .then((batches) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(batches);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.post(authenticate.verifyTeacher, (req, res, next) => {
    req.body.mentor = req.user._id
    Mentoring.create(req.body)
    .then((batch) => {
        console.log('Batch Created: ' + batch);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(batch);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.put(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation NOT supported on /mentoring');
})

.delete(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation NOT supported on /mentoring');
});


//SPECIFC BATCH
router.route('/:batchId')
.get(authenticate.verifyTeacher, (req, res, next) => {
    Mentoring.findById(req.params.batchId)
    .then((batch) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(batch);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.post(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation NOT supported on /mentoring/' + req.params.batchId);
})

.put(authenticate.verifyTeacher, (req, res, next) => {
    Mentoring.findById(req.params.batchId)
    .then((batch) => {
        if(batch != null) {
            if(!batch.mentor.equals(req.user._id)) {
                var err = new Error('You are not authorised to update this batch');
                err.status= 403;
                return next(err);
            }
            else{    
                Mentoring.findByIdAndUpdate(req.params.batchId, {
                    $set: req.body
                }, {
                    new: true
                })
                .then((batch) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(batch);
                }, (err) => next(err))
                .catch((err) => {
                    next(err);
                })
            }
        }
        else {
            var err = new Error('Batch does not exist');
            err.status= 403;
            return next(err);
        }
    })
})

.delete(authenticate.verifyTeacher, (req, res, next) => {
    Mentoring.findById(req.params.batchId)
    .then((batch) => {
        if(batch != null) {
            if(!batch.mentor.equals(req.user._id)) {
                var err = new Error('You are not authorised to update this batch');
                err.status= 403;
                return next(err);
            }
            else {           
                Mentoring.findByIdAndRemove(req.params.batchId)
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(response);
                }, (err) => next(err))
                .catch((err) => {
                    next(err);
                })
            }
        }
        else {
            var err = new Error('Batch does not exist');
            err.status= 403;
            return next(err);
        }
    })
});

router.route('/:batchId/meetings')
.get(authenticate.verifyTeacher, (req, res, next) => {
    Mentoring.findById(req.params.batchId)
    .then((batch) => {
        if(batch != null) {
            if(!batch.mentor.equals(req.user._id)) {
                var err = new Error('You are not authorised to update this batch');
                err.status= 403;
                return next(err);
            }
            else {      
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(batch.meetings);
            }
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.post(authenticate.verifyTeacher, (req, res, next) => {
    Mentoring.findById(req.params.batchId)
    .then((batch) => {
        if(batch != null) {
            if(!batch.mentor.equals(req.user._id)) {
                var err = new Error('You are not authorised to update this batch');
                err.status= 403;
                return next(err);
            }
            else {      
                batch.meetings.push(req.body)
                batch.save()
                .then((batch) => {
                    Mentoring.findById(req.params.batchId)
                    .then((batch) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(batch.meetings);
                    })
                })
            }
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.put(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation NOT supported on /mentoring/' + req.params.batchId + '/meetings');
})

.delete(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation NOT supported on /mentoring/' + req.params.batchId + '/students');
});

router.route('/:batchId/meetings/:meetingId')
.delete(authenticate.verifyTeacher, (req, res, next) => {
    Mentoring.findById(req.params.batchId)
    .then((batch) => {
        if(batch != null) {
            if(!batch.mentor.equals(req.user._id)) {
                var err = new Error('You are not authorised to update this batch');
                err.status= 403;
                return next(err);
            }
            else {           
                batch.meetings.id(req.params.meetingId).remove()
                batch.save()
                .then((batch) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(batch.meetings);
                }, (err) => next(err))
            }
        }
        else {
            var err = new Error('Batch does not exist');
            err.status= 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
});

//STUDENTS IN SPECIFIC BATCHES
router.route('/:batchId/students')
.get(authenticate.verifyTeacher, (req, res, next) => {
    StudentBatch.find({batch: req.params.batchId})
    .populate('mentee')
    .populate('batch')
    .then((students) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(students);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.post(authenticate.verifyTeacher, (req, res, next) => {
    req.body.batch = req.params.batchId;
    Mentoring.findById(req.params.batchId)
    .then((batch) => {
        if(batch != null) {
            if(!batch.mentor.equals(req.user._id)) {
                var err = new Error('You are not authorised to update this batch');
                err.status= 403;
                return next(err);
            }
            else if(req.body.mentee != null) {
                StudentBatch.create(req.body)
                .then((record) => {  
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(record);
                },(err) => next(err));              
            }
            else{
                var err = new Error('Parameters Missing');
                err.status= 403;
                return next(err);
            }
        }
        else {
            var err = new Error('Batch does not exist');
            err.status= 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation NOT supported on /mentoring/' + req.params.batchId + '/students');
})

.delete(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation NOT supported on /mentoring/' + req.params.batchId + '/students');
});

//SPECIFIC STUDENT IN SPECIFIC BATCH
router.route('/:batchId/students/:studentId')
.get(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation NOT supported on /mentoring/' + req.params.batchId + '/students' + req.params.batchId);
})
.post(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation NOT supported on /mentoring/' + req.params.batchId + '/students' + req.params.studentId);
})

.put(authenticate.verifyTeacher, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation NOT supported on /mentoring/' + req.params.batchId + '/students' + req.params.studentId);
})

.delete(authenticate.verifyTeacher, (req, res, next) => {
    StudentBatch.findOneAndDelete({mentee: req.params.studentId})
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
    }, (err) => next(err))
});

module.exports = router;