const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    activiity: {
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
    enroll: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    admissionDate: {
        type: Date
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
    internships: [internshipSchema],
    onlineCourses: [onlineCourseSchema],
    majorAbsence: [majorAbsenceSchema],
    disciplinary: [disciplinarySchema]
},{
    timestamps: true
});

var Student = mongoose.model('Student', studentSchema);

module.exports = Student;