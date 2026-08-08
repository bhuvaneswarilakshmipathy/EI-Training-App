const mongoose = require("mongoose");

const trialSchema = new mongoose.Schema(
  {
    emotion: {
      type: String,
      required: true,
    },
    trialNumber: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      enum: [0, 1],
      required: true,
    },
    detectedEmotion: {
      type: String,
      default: "",
    },
    timeTaken: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const moduleProgressSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },
    studentId: {
      type: String,
      required: true,
      index: true,
    },
    sessionType: {
      type: String,
      enum: ["pre", "post"],
      required: true,
    },
    moduleId: {
      type: Number,
      required: true,
    },
    moduleName: {
      type: String,
      required: true,
    },
    currentEmotionIndex: {
      type: Number,
      default: 0,
    },
    currentTrialNumber: {
      type: Number,
      default: 1,
    },
    totalTrialsCompleted: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    trials: {
      type: [trialSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ModuleProgress", moduleProgressSchema);