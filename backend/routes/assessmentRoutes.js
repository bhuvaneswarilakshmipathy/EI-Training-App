const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");
const ModuleProgress = require("../models/ModuleProgress");

router.post("/pretest", async (req, res) => {
  try {
    const {
      studentId,
      interventionDuration = "",
      setting = "",
      type = "pre",
      modules = {},
    } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const formattedModules = Object.keys(modules).map((key) => ({
      moduleName: key,
      date: new Date().toISOString().split("T")[0],
      assessor: modules[key]?.assessor || "",
    }));

    const completedAssessment = await Assessment.findOne({
  studentId,
  type,
  status: "completed",
}).sort({ updatedAt: -1 });

if (completedAssessment) {
  return res.status(400).json({
    error: `${type === "pre" ? "Pre-Test" : "Post-Test"} already completed for this student`,
    alreadyCompleted: true,
    data: completedAssessment,
  });
}

let assessment = await Assessment.findOne({
  studentId,
  type,
  status: "in_progress",
}).sort({ updatedAt: -1 });

if (assessment) {
  assessment.interventionDuration = interventionDuration;
  assessment.setting = setting;
  assessment.modules = formattedModules;
  await assessment.save();

  return res.status(200).json({
    message: "Existing assessment resumed",
    data: assessment,
    resumed: true,
  });
}

assessment = new Assessment({
      studentId,
      interventionDuration,
      setting,
      type,
      status: "in_progress",
      currentModule: 1,
      modules: formattedModules,
    });

    await assessment.save();

    res.status(201).json({
      message: "New assessment created",
      data: assessment,
      resumed: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/resume/:studentId/:type", async (req, res) => {
  try {
    const { studentId, type } = req.params;

    const assessment = await Assessment.findOne({
      studentId,
      type,
      status: "in_progress",
    }).sort({ updatedAt: -1 });

    if (!assessment) {
      return res.status(404).json({ error: "No in-progress assessment found" });
    }

    res.json({
      message: "In-progress assessment found",
      data: assessment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const buildSessionSummary = (modules = []) => {
  const allTrials = modules.flatMap((module) => module.trials || []);

  const totalTrials = allTrials.length;
  const totalCorrect = allTrials.filter((trial) => Number(trial.score) > 0).length;
  const totalTime = allTrials.reduce((sum, trial) => sum + Number(trial.timeTaken || 0), 0);
  const averageScore = totalTrials > 0 ? Number(((totalCorrect / totalTrials) * 100).toFixed(2)) : 0;

  const emotionMap = {};

  allTrials.forEach((trial) => {
    const emotion = trial.emotion || "Unknown";

    if (!emotionMap[emotion]) {
      emotionMap[emotion] = {
        emotion,
        trials: 0,
        correct: 0,
        wrong: 0,
        totalTime: 0,
      };
    }

    emotionMap[emotion].trials += 1;
    emotionMap[emotion].totalTime += Number(trial.timeTaken || 0);

    if (Number(trial.score) > 0) {
      emotionMap[emotion].correct += 1;
    } else {
      emotionMap[emotion].wrong += 1;
    }
  });

  const emotionStats = Object.values(emotionMap).map((item) => ({
    ...item,
    accuracy: item.trials ? Number(((item.correct / item.trials) * 100).toFixed(2)) : 0,
    avgTime: item.trials ? Number((item.totalTime / item.trials).toFixed(2)) : 0,
  }));

  const maxAccuracy = emotionStats.length
    ? Math.max(...emotionStats.map((item) => item.accuracy))
    : 0;

  const minAccuracy = emotionStats.length
    ? Math.min(...emotionStats.map((item) => item.accuracy))
    : 0;

  const strongestEmotions = emotionStats
    .filter((item) => item.accuracy === maxAccuracy)
    .map((item) => item.emotion);

  const weakestEmotions = emotionStats
    .filter((item) => item.accuracy === minAccuracy)
    .map((item) => item.emotion);

  return {
    totalTrials,
    totalCorrect,
    totalTime: Number(totalTime.toFixed(2)),
    averageScore,
    strongestEmotions,
    weakestEmotions,
  };
};

const buildPatternAnalysis = (summary, label) => {
  if (!summary || summary.totalTrials === 0) {
    return `${label} data is not available.`;
  }

  const strongest =
    summary.strongestEmotions.length > 0
      ? summary.strongestEmotions.join(", ")
      : "no clearly strong emotion category";

  const weakest =
    summary.weakestEmotions.length > 0
      ? summary.weakestEmotions.join(", ")
      : "no clearly weak emotion category";

  let performanceBand = "emerging";
  if (summary.averageScore >= 75) {
    performanceBand = "strong";
  } else if (summary.averageScore >= 50) {
    performanceBand = "developing";
  }

  return `${label} results indicate ${performanceBand} emotion recognition performance. Stronger response patterns were observed in ${strongest}, while more support appears needed in ${weakest}. The session recorded ${summary.totalCorrect} correct responses out of ${summary.totalTrials} trials with an average score of ${summary.averageScore}%.`;
};

router.get("/student-report/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const [preAssessment, postAssessment] = await Promise.all([
  Assessment.findOne({ studentId, type: "pre", status: "completed" }).sort({ updatedAt: -1 }),
  Assessment.findOne({ studentId, type: "post", status: "completed" }).sort({ updatedAt: -1 }),
]);

    if (!preAssessment || !postAssessment) {
  return res.status(400).json({
    error: "Both pre-test and post-test must be completed to download the report",
  });
}

    const [preModules, postModules] = await Promise.all([
      ModuleProgress.find({
        assessmentId: preAssessment._id,
        studentId,
        sessionType: "pre",
        moduleId: { $in: [1, 2, 3] },
      }).sort({ moduleId: 1 }),

      ModuleProgress.find({
        assessmentId: postAssessment._id,
        studentId,
        sessionType: "post",
        moduleId: { $in: [1, 2, 3] },
      }).sort({ moduleId: 1 }),
    ]);

    const preSummary = buildSessionSummary(preModules);
    const postSummary = buildSessionSummary(postModules);

    const reportData = {
      studentId,
      preTest: {
        assessmentId: preAssessment._id,
        status: preAssessment.status,
        interventionDuration: preAssessment.interventionDuration || "",
        setting: preAssessment.setting || "",
        summary: preSummary,
        commonPatternAnalysis: buildPatternAnalysis(preSummary, "Pre-Test"),
      },
      postTest: {
        assessmentId: postAssessment._id,
        status: postAssessment.status,
        interventionDuration: postAssessment.interventionDuration || "",
        setting: postAssessment.setting || "",
        summary: postSummary,
        commonPatternAnalysis: buildPatternAnalysis(postSummary, "Post-Test"),
      },
      recommendation: (() => {
        const scoreDiff = Number((postSummary.averageScore - preSummary.averageScore).toFixed(2));
        const timeDiff = Number((postSummary.totalTime - preSummary.totalTime).toFixed(2));

        const improvedText =
          scoreDiff > 0
            ? `Overall performance improved by ${scoreDiff} percentage points from pre-test to post-test.`
            : scoreDiff < 0
            ? `Overall performance decreased by ${Math.abs(scoreDiff)} percentage points from pre-test to post-test.`
            : "Overall performance remained stable between pre-test and post-test.";

        const timingText =
          timeDiff < 0
            ? `Total response time decreased by ${Math.abs(timeDiff)} seconds, suggesting better efficiency.`
            : timeDiff > 0
            ? `Total response time increased by ${timeDiff} seconds, which may indicate a need for continued fluency practice.`
            : "Total response time remained unchanged.";

        const weakAreas =
          postSummary.weakestEmotions.length > 0
            ? `Continued guided practice is recommended for ${postSummary.weakestEmotions.join(", ")}.`
            : "Continue reinforcement across all emotion categories.";

        return `${improvedText} ${timingText} ${weakAreas}`;
      })(),
    };

    res.json({
      message: "Student report data loaded successfully",
      data: reportData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load student report data" });
  }
});

module.exports = router;