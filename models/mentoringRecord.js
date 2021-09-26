const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const student = require('./student');
const teacher = require('./teacher');

const meetingSchema = new Schema({
    attendence: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    advice: {
        type: String,
        required: true
    }
})

const mentoringSchema = new Schema({
    mentor: teacher,
    mentees: [student],
    from: {
        type: Date,
        required: true
    },
    To: {
        type: Date
    },
    meetings: [meetingSchema]
});

var Student = mongoose.model('Student', studentSchema);

module.exports = Student;