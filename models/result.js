const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courses = require('./course');
const student = require('./student');

const subjectSchema = new Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
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
        default: -1
    },
    mst2: {
        type: Number,
        default: -1
    },
    endSemT: {
        type: String,
        default: -1
    },
    endSemP: {
        type: String,
        default: -1
    },
    credits: {
        type: Number,
        required: true
    },
    attendenceT: {
        type: Number,
        default: -1
    },
    attendenceP: {
        type: Number,
        default: -1
    },
});

const resultSchema = new Schema({
    enroll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    cgpa: {
        type: Number,
        default: -1
    },
    sgpa: {
        type: Number,
        default: -1
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
        type: Number
    },
    subjects: [subjectSchema]
},{
    timestamps: true
});

var Result = mongoose.model('Result', resultSchema);

module.exports = Result;