import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useEmotionModule from "../../../hooks/useEmotionModule";
import EmotionModuleShell from "../../../components/module/EmotionModuleShell";

function MatchingGame() {
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
    moduleId: 1,
    moduleName: "Matching Game",
    nextRouteOnComplete: "/module1-result",
  });

  if (!assessmentId) return null;

  return (
    <EmotionModuleShell
      moduleTitle="Module 1: Matching Game"
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
        <div className="space-y-4">
          <div className="section-card card-yellow p-5">
            <p className="badge-soft mb-3">Preparation</p>
            <h2 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
              Emotion cards for the activity
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
              Download the emotion cards, print them, and keep them ready before
              starting the test.
            </p>

            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[color:var(--color-border-soft)] bg-white shadow-[var(--shadow-soft)]">
              <iframe
                src="/emotion_cards.pdf"
                title="Emotion Cards"
                className="h-[320px] w-full sm:h-[380px] lg:h-[420px]"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a href="/emotion_cards.pdf" download className="inline-flex">
                <button type="button" className="btn-primary">
                  Download PDF
                </button>
              </a>

              <a
                href="/emotion_cards.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Open Full View
              </a>
            </div>
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-4">
          <div className="section-card card-pink p-5">
            <p className="badge-pink mb-3">Current task</p>
            <h1 className="text-kid-heading text-2xl sm:text-3xl text-[color:var(--color-text-main)]">
              Show the card for:
            </h1>

            <div className="mt-4 inline-flex rounded-full bg-white px-5 py-3 shadow-[var(--shadow-soft)]">
              <span className="text-xl font-extrabold text-brand-700 sm:text-2xl">
                {module.currentEmotion}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-pink-600">
                  Trial
                </p>
                <p className="mt-2 text-lg font-extrabold text-[color:var(--color-text-main)]">
                  {module.trial} / 3
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
                  Instruction
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--color-text-main)]">
                  Ask the child to hold up the matching emotion card to the webcam.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default MatchingGame;