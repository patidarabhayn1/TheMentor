const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Student = require('../models/student');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/InternshipCertificate');
    },

    filename: (req, file, cb) => {
        cb(null, req.user.username + "Internship" + Date.now()+".pdf")
    }
});

const FileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(pdf)$/)) {
        return cb(new Error('You can upload only PDFs!'), false);
    }
    cb(null, true);
};

var options = {
    root: path.join("./public/InternshipCertificate")
};

const upload = multer({ storage: storage, fileFilter: FileFilter});

const internshipRouter = express.Router();

internshipRouter.use(bodyParser.json());

internshipRouter.route('/')
.get(authenticate.verifyStudent, (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        if(student != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(student.internships);
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
.post(authenticate.verifyStudent, upload.single('certificate'), (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        if(student != null) {
            req.body.certificate = req.file.filename;
            student.internships.push(req.body)
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
.put(authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})
.delete(authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported');
});


internshipRouter.route('/:internshipId')
.get(authenticate.verifyStudent, (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        var record = student.internships.id(req.params.internshipId);
        var filename = record.certificate;
        res.sendFile(filename,  options,  (err) => {
            if(err){
                next(err);
            }
            else {
                console.log("Sent:", options.root , "\\" , filename);
            }
        })
    }, (err) => next(err))
    .catch((err) => {
        console.log(err);
        next(err);
    })
})
.post(authenticate.verifyStudent, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})
.put(authenticate.verifyStudent, (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        if(student != null) {
            Object.assign(student.internships.id(req.params.internshipId),req.body)
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
.delete(authenticate.verifyStudent, (req, res, next) => {
    Student.findById(req.user._id)
    .then((student) => {
        if(student != null){
            var record = student.internships.id(req.params.internshipId);
            console.log("Deleted: ", path.resolve('./public/InternshipCertificate' + record.certificate));    
            student.internships.id(req.params.internshipId).remove()
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

module.exports = internshipRouter;