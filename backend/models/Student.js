const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  childId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true
  },
  communication: {
    type: String,
    required: true
  },
  iep: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);