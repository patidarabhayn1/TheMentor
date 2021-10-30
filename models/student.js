const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const internshipSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    certificate: {
        type: String,
        required: true
    }
});

const onlineCourseSchema = new Schema({
    platform: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    certificate: {
        type: String,
        required: true
    }
});

const majorAbsenceSchema = new Schema({
    reason: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    }
});

const disciplinarySchema = new Schema({
    activity: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    punishment: {
        type: String,
        default: ''
    },
    remark: {
        type: String,
        default: ''
    },
});

const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    admissionDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    undertakingUrl: {
        type: String,
        default: ''
    },
    isTeacher: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    internships: [internshipSchema],
    courses: [onlineCourseSchema],
    majorAbsence: [majorAbsenceSchema],
    disciplinary: [disciplinarySchema]
},{
    timestamps: true
});

studentSchema.plugin(passportLocalMongoose);

var Student = mongoose.model('Student', studentSchema);

module.exports = Student;