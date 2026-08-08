import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useEmotionModule from "../../../hooks/useEmotionModule";
import EmotionModuleShell from "../../../components/module/EmotionModuleShell";

const socialStoryImageMap = {
  Neutral: "/social-story/neutral.png",
  Happiness: "/social-story/happiness.png",
  Sadness: "/social-story/sadness.jpeg",
  Anger: "/social-story/anger.png",
  Fear: "/social-story/fear.jpeg",
  Disgust: "/social-story/disgust.png",
  Surprise: "/social-story/surprise.png",
  Contempt: "/social-story/contempt.png",
};

function SocialStory() {
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
    moduleId: 3,
    moduleName: "Social Story",
    nextRouteOnComplete: "/module3-result",
  });

  if (!assessmentId) return null;

  return (
    <EmotionModuleShell
      moduleTitle="Module 3: Social Story"
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
            Look at the story picture
          </h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
            Show the child the scenario image and ask them to express the emotion shown.
          </p>
        </div>
      }
      leftContent={
        <div className="space-y-4">
          <div className="section-card card-pink p-4">
            <p className="badge-pink mb-3">Current task</p>

            <h1 className="text-kid-heading text-2xl text-[color:var(--color-text-main)] sm:text-[2rem]">
              Interpret and show:
            </h1>

            <div className="mt-3 inline-flex rounded-full bg-white px-5 py-3 shadow-[var(--shadow-soft)]">
              <span className="text-xl font-extrabold text-pink-600 sm:text-2xl">
                {module.currentEmotion}
              </span>
            </div>

            <div className="mt-4 rounded-[1.5rem] bg-white/85 p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-pink-600">
                    Trial
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-[color:var(--color-text-main)]">
                    {module.trial} / 3
                  </p>
                </div>

                <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600">
                  Social story
                </span>
              </div>

              <div className="flex items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/70 bg-white p-3 shadow-[var(--shadow-soft)]">
                <img
                  src={socialStoryImageMap[module.currentEmotion]}
                  alt={`${module.currentEmotion} social story`}
                  className="max-h-[240px] w-full object-contain sm:max-h-[280px]"
                />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SocialStory;