var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Teacher = require('./models/teacher');
var Student = require('./models/student');
var StudentBatch = require('./models/studentBatch');
var Mentoring = require('./models/mentoringRecord');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

require('dotenv/config');

exports.local = passport.use('teacherLocal',  new LocalStrategy(Teacher.authenticate()));
exports.local = passport.use('studentLocal',  new LocalStrategy(Student.authenticate()));
passport.serializeUser(Teacher.serializeUser());
passport.deserializeUser(Teacher.deserializeUser());

exports.getToken = function(teacher) {
    return jwt.sign(teacher, process.env.SECRET_KEY, {expiresIn: 2678400});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

exports.jwtPassport = passport.use('teacherJWT', new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT Payload: ", jwt_payload);
    Teacher.findOne({_id: jwt_payload._id}, (err, teacher) => {
        if(err) {
            return done(err, false);
        }
        else if(teacher){
            return done(null, teacher);
        }
        else {
            return done(null, false);
        }
    });
}))

exports.jwtPassport = passport.use('studentJWT', new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT Payload: ", jwt_payload);
    Student.findOne({_id: jwt_payload._id}, (err, student) => {
        if(err) {
            return done(err, false);
        }
        else if(student){
            return done(null, student);
        }
        else {
            return done(null, false);
        }
    });
}))

exports.verifyStudent = passport.authenticate('studentJWT', {session: false});
exports.verifyTeacher = passport.authenticate('teacherJWT', {session: false});

exports.verifyAdmin = function(req, res, next) {
    if(!req.user.isAdmin) {
        var err = new Error("You are not authorized to perform this operation");
        err.status = 403;
        return next(err);
    }
    else {
        next();
    }
}

exports.verifyMentor = function(req, res, next) {
    Student.findById(req.params.studentId)
    .then((student) => {
        if(student != null) {
            StudentBatch.find({mentee: student._id})
            .then((record) => {
                if(record.length > 0){
                Mentoring.findById(record[0].batch)
                .then((batch) => {
                    if(batch != null) {
                        if(!batch.mentor.equals(req.user._id)){
                            var err = new Error('You are not authorised to update this student');
                            err.status= 403;
                            return next(err);
                        }
                        else{    
                            next();
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
}