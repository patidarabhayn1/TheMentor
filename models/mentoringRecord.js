const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const student = require('./student');

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
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    from: {
        type: Date,
        required: true
    },
    To: {
        type: Date
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    meetings: [meetingSchema]
});

var Mentoring = mongoose.model('Mentoring', mentoringSchema);

module.exports = Mentoring;