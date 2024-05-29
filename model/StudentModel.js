const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    roll_no: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    linkedIn: {
        type: String,
    },
    parentId:{
      type: String,

    },
    picture: {
        // data: Buffer,
        // contentType: String
        type: String
    },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student 