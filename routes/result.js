var express = require('express');
const Student = require('../models/student');
const Result = require('../models/result');
const bodyParser = require('body-parser')
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(authenticate.verifyStudent,  (req, res, next) => {
    Result.find({enroll: req.user._id})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.post(authenticate.verifyStudent, (req, res, next) => {
    req.body.enroll = req.user._id
    Result.create(req.body)
    .then((result) => {
        console.log('Result Created: ' + result);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.put(authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation NOT supported');
})

.delete(authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation NOT supported');
});

router.route('/:resultId')
.get(authenticate.verifyStudent,  (req, res, next) => {
    Result.find({enroll: req.user._id,  _id: req.params.resultId})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.post(authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation NOT supported');
})

.put(authenticate.verifyStudent, (req, res, next) => {
    Result.find({enroll: req.user._id,  _id: req.params.resultId})
    .then((result) => {
        Result.findByIdAndUpdate(req.params.resultId, {
            $set: req.body
        }, {
            new: true
        })
        .then((result) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
        }, (err) => next(err))
        .catch((err) => {
            next(err);
        })
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})

.delete(authenticate.verifyStudent, (req, res, next) => {
    Result.findByIdAndRemove(req.params.resultId)
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
});


router.route('/:resultId/subjects')
.get(authenticate.verifyStudent,  (req, res, next) => {
    Result.find({enroll: req.user._id, _id: req.params.resultId})
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

.post(authenticate.verifyStudent, (req, res, next) => {
    Result.find({enroll: req.user._id, _id: req.params.resultId})
    .then((result) => {
        if(result.length > 0) {
            Result.findById(req.params.resultId)
            .then((result) => {
                if(result != null) {
                    result.subjects.push(req.body)
                    result.save()
                    .then((result) => {
                        Result.findById(req.params.resultId)
                        .then((result) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(result);
                        })
                    })
                }
                else {
                    var err =  new Error("No result exist with this Result Id");
                    err.statusCode = 403;
                    return next(err);
                }
            })
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

.put(authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation NOT supported');
})

.delete(authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation NOT supported');
});

router.route('/:resultId/subjects/:subjectId')
.get(authenticate.verifyStudent,  (req, res, next) => {
    Result.find({enroll: req.user._id, _id: req.params.resultId})
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

.post(authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('POSt operation NOT supported');
})

.put(authenticate.verifyStudent, (req, res, next) => {
    Result.find({enroll: req.user._id, _id: req.params.resultId})
    .then((result) => {
        if(result.length > 0) {
            Result.findById(req.params.resultId)
            .then((result) => {
                Object.assign(result.subjects.id(req.params.subjectId),req.body)
                result.save()
                .then((result) => {
                    Result.findById(req.params.resultId)
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(result);
                    })
                }, (err) => next(err))
            })
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

.delete(authenticate.verifyStudent, (req, res, next) => {
    Result.find({enroll: req.user._id, _id: req.params.resultId})
    .then((result) => {
        if(result.length > 0) {
            Result.findById(req.params.resultId)
            .then((result) => {
                result.subjects.id(req.params.subjectId).remove()
                result.save()
                .then((result) => {
                    Result.findById(req.params.resultId)
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type','application/json');
                        res.json(result);
                    })
                }, (err) => next(err))
            })
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
});

module.exports = router;