var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Teacher = require('./models/teacher');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(Teacher.authenticate()));
passport.serializeUser(Teacher.serializeUser());
passport.deserializeUser(Teacher.deserializeUser());

exports.getToken = function(teacher) {
    return jwt.sign(teacher, config.secretKey, {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
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

exports.verifyTeacher = passport.authenticate('jwt', {session: false});
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