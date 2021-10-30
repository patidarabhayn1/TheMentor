const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Student = require('./student');
const Mentoring = require('./mentoringRecord');

const studentBatchSchema = new Schema({
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentoring'
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        unique: true
    }
});

var studentBatch = mongoose.model('studentBatch', studentBatchSchema);

module.exports = studentBatch;