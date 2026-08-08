import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useEmotionModule from "../../../hooks/useEmotionModule";
import EmotionModuleShell from "../../../components/module/EmotionModuleShell";

const mirrorImageMap = {
  Neutral: "/emotion-mirror/neutral.png",
  Happiness: "/emotion-mirror/happy.png",
  Sadness: "/emotion-mirror/sadness.jpeg",
  Anger: "/emotion-mirror/anger.png",
  Fear: "/emotion-mirror/fear.png",
  Disgust: "/emotion-mirror/disgust.png",
  Surprise: "/emotion-mirror/surprise.png",
  Contempt: "/emotion-mirror/contempt.png",
};

function EmotionMirrorGame() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const studentId = params.studentId;
  const assessmentId = params.assessmentId || location.state?.assessmentId;
  const sessionType = params.sessionType || location.state?.sessionType || "pre";

  useEffect(() => {
    if (!assessmentId && studentId) {
      alert("Assessment information missing. Please start from Pre-Test again.");
      navigate(`/pretest/${studentId}`);
    }
  }, [assessmentId, studentId, navigate]);

  const module = useEmotionModule({
    studentId,
    assessmentId,
    sessionType,
    moduleId: 2,
    moduleName: "Emotion Mirror Game",
    nextRouteOnComplete: "/module2-result",
  });

  if (!assessmentId) return null;

  return (
    <EmotionModuleShell
      moduleTitle="Module 2: Emotion Mirror Game"
      currentEmotion={module.currentEmotion}
      trial={module.trial}
      results={module.results}
      previewResult={module.previewResult}
      lastSavedResult={module.lastSavedResult}
      showReward={module.showReward}
      loadingProgress={module.loadingProgress}
      startTest={module.startTest}
      startButtonLabel={module.results.length > 0 ? "Resume Test" : "Start Test"}
      onStart={module.startModuleTest}
      onDetect={module.handleDetectPreview}
      onNext={module.handleNextTrial}
      detecting={module.detecting}
      savingTrial={module.savingTrial}
      videoRef={module.videoRef}
      canvasRef={module.canvasRef}
      showAssistancePrompt={module.showAssistancePrompt}
      pendingEmotionForAssistance={module.pendingEmotionForAssistance}
      onSaveAssistance={module.handleSaveAssistance}
      savingAssistance={module.savingAssistance}
      introContent={
        <div className="section-card card-yellow p-5">
          <p className="badge-soft mb-3">How to play</p>
          <h2 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
            Copy the face emotion
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
            The child should look at the target face and imitate the same emotion.
          </p>
        </div>
      }
      leftContent={
        <div className="space-y-4">
          <div className="section-card card-purple p-4">
            <p className="badge-soft mb-3">Current task</p>

            <h1 className="text-kid-heading text-2xl text-[color:var(--color-text-main)] sm:text-[2rem]">
              Make this emotion:
            </h1>

            <div className="mt-3 inline-flex rounded-full bg-white px-5 py-3 shadow-[var(--shadow-soft)]">
              <span className="text-xl font-extrabold text-brand-700 sm:text-2xl">
                {module.currentEmotion}
              </span>
            </div>

            <div className="mt-4 rounded-[1.5rem] bg-white/85 p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                    Trial
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[color:var(--color-text-main)]">
                    {module.trial} / 3
                  </p>
                </div>

                <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
                  Mirror activity
                </span>
              </div>

              <div className="flex items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/70 bg-white p-3 shadow-[var(--shadow-soft)]">
                <img
                  src={mirrorImageMap[module.currentEmotion]}
                  alt={module.currentEmotion}
                  className="max-h-[220px] w-full object-contain sm:max-h-[250px]"
                />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default EmotionMirrorGame;