const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const teacherSchema = new Schema({
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
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

teacherSchema.plugin(passportLocalMongoose);

var Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;