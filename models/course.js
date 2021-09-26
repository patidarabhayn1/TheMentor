const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true,
        unique: true
    }
});

var Courses = mongoose.model('Courses', courseSchema);

module.exports = Courses;