const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Student = require('../models/student');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/CourseCertificate');
    },

    filename: (req, file, cb) => {
        cb(null, req.user.username + "Course" + Date.now()+".pdf")
    }
});

const FileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(pdf)$/)) {
        return cb(new Error('You can upload only PDFs!'), false);
    }
    cb(null, true);
};

var options = {
    root: path.join("./public/CourseCertificate")
};

const upload = multer({ storage: storage, fileFilter: FileFilter});

const courseRouter = express.Router();

courseRouter.use(bodyParser.json());

courseRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyStudent, (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        if(student != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(student.courses);
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
.post(cors.corsWithOptions, authenticate.verifyStudent, upload.single('certificate'), (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        if(student != null) {
            req.body.certificate = req.file.filename;
            student.courses.push(req.body)
            student.save()
            .then((student) => {
                Student.findById(req.user._id)
                .then((student) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(student);
                })
            })
        }
    }, (err) => next(err))
    .catch((err) => {
        console.log(err);
        next(err);
    })
})
.put(cors.corsWithOptions, authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})
.delete(cors.corsWithOptions, authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported');
});


courseRouter.route('/:courseId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyStudent, (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        if(student != null) {
            var record = student.courses.id(req.params.courseId);
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
        }
    }, (err) => next(err))
    .catch((err) => {
        console.log(err);
        next(err);
    })
})
.post(cors.corsWithOptions, authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})
.put(cors.corsWithOptions, authenticate.verifyStudent, (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        if(student != null) {
            Object.assign(student.courses.id(req.params.courseId),req.body)
            student.save()
            .then((student) => {
                Student.findById(req.user._id)
                .then((student) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(student);
                })
            }, (err) => next(err))
        }
        else {
            var err =  new Error("No Student exist with this Student Id");
            err.statusCode = 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => {
        next(err);
    })
})
.delete(cors.corsWithOptions, authenticate.verifyStudent, (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        if(student != null){
            var record = student.courses.id(req.params.courseId);
            console.log("Deleted: ", path.resolve('./public/InternshipCertificate' + record.certificate));    
            student.courses.id(req.params.courseId).remove()
            student.save()
            .then((student) => {
                fs.unlink(path.resolve('./public/InternshipCertificate/' + record.certificate), function() {
                    res.send ({
                        status: "200",
                        responseType: "string",
                        response: "success"
                    });     
                });
            })
        }
        else {

        }
    }, (err) => next(err))
    .catch((err) => {
        console.log(err);
        next(err);
    })
});

module.exports = courseRouter;