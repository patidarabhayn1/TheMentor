var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Student = require('./models/student');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

exports.getToken = function(student) {
    return jwt.sign(student, config.secretKey, {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT Payload: ", jwt_payload);
    student.findOne({_id: jwt_payload._id}, (err, student) => {
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

exports.verifyStudent = passport.authenticate('jwt', {session: false});