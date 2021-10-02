const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courses = require('./course');
const student = require('./student');

const subjectSchema = new Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses'
    },
    isTheory: {
        type: Boolean,
        required: true
    },
    isPractical: {
        type: Boolean,
        required: true
    },
    mst1: {
        type: Number,
        required: true
    },
    mst2: {
        type: Number,
        required: true
    },
    endSemT: {
        type: String
    },
    endSemP: {
        type: String
    },
    credits: {
        type: Number,
        required: true
    },
    attendenceT: {
        type: Number,
    },
    attendenceP: {
        type: Number,
    },
});

const resultSchema = new Schema({
    enroll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    cgpa: {
        type: Number,
        required: true
    },
    sgpa: {
        type: Number,
        required: true
    },
    sem: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    },
    year: {
        type: Number,
        required: true
    },
    creditsEarned: {
        type: Number,
        required: true
    },
    subjects: [subjectSchema]
},{
    timestamps: true
});

var Result = mongoose.model('Result', resultSchema);

module.exports = Result;