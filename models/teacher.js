const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    staffId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    joiningDate: {
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
    }
},{
    timestamps: true
});

var Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;