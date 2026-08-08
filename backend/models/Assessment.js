const mongoose = require("mongoose");

const moduleMetaSchema = new mongoose.Schema(
  {
    moduleName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    assessor: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      index: true,
    },
    interventionDuration: {
      type: String,
      default: "",
    },
    setting: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["pre", "post"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
      index: true,
    },
    currentModule: {
      type: Number,
      default: 1,
    },
    modules: {
      type: [moduleMetaSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);