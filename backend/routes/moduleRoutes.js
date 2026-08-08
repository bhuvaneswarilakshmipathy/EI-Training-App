const express = require("express");
const router = express.Router();
const ModuleProgress = require("../models/ModuleProgress");
const Assessment = require("../models/Assessment");

const EMOTIONS = [
  "Neutral",
  "Happiness",
  "Sadness",
  "Anger",
  "Fear",
  "Disgust",
  "Surprise",
  "Contempt",
];

router.get("/assessment-progress/:assessmentId", async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId);

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    const currentModule = Number(assessment.currentModule || 1);

    res.json({
      message: "Assessment progress fetched successfully",
      data: {
        assessmentId: assessment._id,
        studentId: assessment.studentId,
        sessionType: assessment.type,
        currentModule,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch assessment progress" });
  }
});

router.post("/start", async (req, res) => {
  try {
    const { assessmentId, studentId, sessionType, moduleId, moduleName } = req.body;

    if (!assessmentId || !studentId || !sessionType || !moduleId || !moduleName) {
      return res.status(400).json({
        error: "assessmentId, studentId, sessionType, moduleId, and moduleName are required",
      });
    }

    const numericModuleId = Number(moduleId);

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    if (Number(assessment.currentModule || 1) > numericModuleId) {
      return res.status(400).json({
        error: `Module ${numericModuleId} already completed. Resume from Module ${assessment.currentModule}.`,
        currentModule: Number(assessment.currentModule),
      });
    }

    let moduleProgress = await ModuleProgress.findOne({
      assessmentId,
      studentId,
      sessionType,
      moduleId: numericModuleId,
    }).sort({ updatedAt: -1 });

    if (moduleProgress) {
      return res.status(200).json({
        message: "Existing module progress resumed",
        data: moduleProgress,
        resumed: true,
      });
    }

    moduleProgress = new ModuleProgress({
      assessmentId,
      studentId,
      sessionType,
      moduleId: numericModuleId,
      moduleName,
      currentEmotionIndex: 0,
      currentTrialNumber: 1,
      totalTrialsCompleted: 0,
      averageScore: 0,
      status: "in_progress",
      trials: [],
    });

    await moduleProgress.save();

    await Assessment.findByIdAndUpdate(assessmentId, {
      currentModule: numericModuleId,
    });

    res.status(201).json({
      message: "New module progress created",
      data: moduleProgress,
      resumed: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start/resume module" });
  }
});

router.get("/resume", async (req, res) => {
  try {
    const { assessmentId, studentId, sessionType, moduleId } = req.query;

    if (!assessmentId || !studentId || !sessionType || !moduleId) {
      return res.status(400).json({
        error: "assessmentId, studentId, sessionType and moduleId are required",
      });
    }

    const moduleProgress = await ModuleProgress.findOne({
      assessmentId,
      studentId,
      sessionType,
      moduleId: Number(moduleId),
    }).sort({ updatedAt: -1 });

    if (!moduleProgress) {
      return res.status(404).json({ error: "No module progress found" });
    }

    res.json({
      message: "Module progress found",
      data: moduleProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to resume module" });
  }
});

router.post("/:id/trial", async (req, res) => {
  try {
    const { emotion, score, detectedEmotion = "", timeTaken = 0 } = req.body;

    const moduleProgress = await ModuleProgress.findById(req.params.id);

    if (!moduleProgress) {
      return res.status(404).json({ error: "Module not found" });
    }

    if (moduleProgress.status === "completed") {
      return res.status(400).json({ error: "Module already completed" });
    }

    moduleProgress.trials.push({
      emotion,
      trialNumber: moduleProgress.currentTrialNumber,
      score,
      detectedEmotion,
      timeTaken,
      completedAt: new Date(),
    });

    moduleProgress.totalTrialsCompleted = moduleProgress.trials.length;

    const totalScore = moduleProgress.trials.reduce((sum, t) => sum + t.score, 0);
    moduleProgress.averageScore =
      moduleProgress.trials.length > 0 ? totalScore / moduleProgress.trials.length : 0;

    const nextTrialNumber = moduleProgress.currentTrialNumber + 1;

    if (nextTrialNumber <= 3) {
      moduleProgress.currentTrialNumber = nextTrialNumber;
    } else {
      moduleProgress.currentTrialNumber = 1;
      moduleProgress.currentEmotionIndex += 1;
    }

    if (
  moduleProgress.currentEmotionIndex >= EMOTIONS.length &&
  moduleProgress.totalTrialsCompleted >= 24
) {
  moduleProgress.status = "completed";

  if (Number(moduleProgress.moduleId) === 3) {
    await Assessment.findByIdAndUpdate(moduleProgress.assessmentId, {
      currentModule: 4,
      status: "completed",
    });
  } else {
    await Assessment.findByIdAndUpdate(moduleProgress.assessmentId, {
      currentModule: moduleProgress.moduleId + 1,
      status: "in_progress",
    });
  }
} else {
  await Assessment.findByIdAndUpdate(moduleProgress.assessmentId, {
    currentModule: moduleProgress.moduleId,
  });
}

    await moduleProgress.save();

    res.json({
      message: "Trial saved successfully",
      data: moduleProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add trial" });
  }
});

router.get("/result", async (req, res) => {
  try {
    const { assessmentId, studentId, sessionType, moduleId } = req.query;

    if (!assessmentId || !studentId || !sessionType || !moduleId) {
      return res.status(400).json({
        error: "assessmentId, studentId, sessionType and moduleId are required",
      });
    }

    const moduleProgress = await ModuleProgress.findOne({
      assessmentId,
      studentId,
      sessionType,
      moduleId: Number(moduleId),
    }).sort({ updatedAt: -1 });

    if (!moduleProgress) {
      return res.status(404).json({ error: "Module result not found" });
    }

    res.json({
      message: "Module result loaded successfully",
      data: moduleProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load module result" });
  }
});

router.post("/:id/assistance", async (req, res) => {
  try {
    const { emotion, assistanceUsed } = req.body;

    const moduleProgress = await ModuleProgress.findById(req.params.id);

    if (!moduleProgress) {
      return res.status(404).json({ error: "Module not found" });
    }

    if (!emotion || typeof assistanceUsed !== "boolean") {
      return res.status(400).json({
        error: "emotion and assistanceUsed are required",
      });
    }

    const matchingTrials = moduleProgress.trials.filter(
      (trial) => trial.emotion === emotion
    );

    if (matchingTrials.length < 3) {
      return res.status(400).json({
        error: "Assistance can only be saved after 3 trials of the same emotion",
      });
    }

    let updatedCount = 0;

    for (let i = moduleProgress.trials.length - 1; i >= 0; i--) {
      if (
        moduleProgress.trials[i].emotion === emotion &&
        updatedCount < 3
      ) {
        moduleProgress.trials[i].assistanceUsed = assistanceUsed;
        updatedCount++;
      }
    }

    await moduleProgress.save();

    res.json({
      message: "Assistance saved successfully",
      data: moduleProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save assistance" });
  }
});

router.get("/consolidated-result", async (req, res) => {
  try {
    const { assessmentId, studentId, sessionType } = req.query;

    if (!assessmentId || !studentId || !sessionType) {
      return res.status(400).json({
        error: "assessmentId, studentId and sessionType are required",
      });
    }

    const modules = await ModuleProgress.find({
      assessmentId,
      studentId,
      sessionType,
      moduleId: { $in: [1, 2, 3] },
    }).sort({ moduleId: 1 });

    if (!modules || modules.length === 0) {
      return res.status(404).json({
        error: "No consolidated pre-test result found",
      });
    }

    res.json({
      message: "Consolidated pre-test result loaded successfully",
      data: modules,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to load consolidated pre-test result",
    });
  }
});

module.exports = router;