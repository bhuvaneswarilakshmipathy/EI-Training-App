import Confetti from "react-confetti";
import { useEffect, useState } from "react";

function EmotionModuleShell({
  moduleTitle,
  currentEmotion,
  trial,
  results,
  previewResult,
  lastSavedResult,
  showReward,
  loadingProgress,
  startTest,
  startButtonLabel,
  onStart,
  onDetect,
  onNext,
  detecting,
  savingTrial,
  videoRef,
  canvasRef,
  introContent,
  leftContent,
  showAssistancePrompt,
  pendingEmotionForAssistance,
  onSaveAssistance,
  savingAssistance,
}) {
const [screenSize, setScreenSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});

useEffect(() => {
  const handleResize = () => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const completedTrials = results?.length || 0;
  const hasSavedProgress = completedTrials > 0;

  if (loadingProgress) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="page-card w-full max-w-2xl text-center">
          <p className="badge-soft mb-3">Please wait</p>
          <h2 className="text-kid-heading text-3xl text-[color:var(--color-text-main)]">
            Loading module progress...
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-soft)]">
            Please wait while saved progress is being checked.
          </p>
        </div>
      </main>
    );
  }

  if (!startTest) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="page-card w-full max-w-4xl p-6 sm:p-8">
          <p className="badge-pink mb-3">Module ready</p>
          <h1 className="text-kid-heading text-3xl text-[color:var(--color-text-main)] sm:text-4xl">
            {moduleTitle}
          </h1>

          <div className="mt-5">{introContent}</div>

          {hasSavedProgress && (
            <div className="section-card card-sky mt-5 p-5">
              <p className="badge-soft mb-3">Saved progress found</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                    Completed Trials
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[color:var(--color-text-main)]">
                    {completedTrials} / 24
                  </p>
                </div>

                <div className="rounded-[1.25rem] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                    Current Trial
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[color:var(--color-text-main)]">
                    {trial} / 3
                  </p>
                </div>

                <div className="rounded-[1.25rem] bg-white/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                    Current Emotion
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-[color:var(--color-text-main)]">
                    {currentEmotion}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button type="button" onClick={onStart} className="btn-primary mt-6">
            {startButtonLabel}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-dvh overflow-hidden px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
      {showReward && (
  <Confetti
    width={screenSize.width}
    height={screenSize.height}
    numberOfPieces={30000}
gravity={0.18}
initialVelocityY={22}
tweenDuration={10000}
    colors={[
      "#a78bfa",
      "#f472b6",
      "#60a5fa",
      "#facc15",
      "#34d399",
      "#fb923c",
      "#ffffff",
    ]}
  />
)}

      {showAssistancePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="page-card w-full max-w-md text-center p-6">
            <p className="badge-pink mb-3">Assistance check</p>
            <h2 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
              Assistance Used?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-soft)]">
              Emotion completed:{" "}
              <span className="font-bold text-[color:var(--color-text-main)]">
                {pendingEmotionForAssistance}
              </span>
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onSaveAssistance(true)}
                disabled={savingAssistance}
                className="flex-1 rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                With Assistance
              </button>

              <button
                type="button"
                onClick={() => onSaveAssistance(false)}
                disabled={savingAssistance}
                className="flex-1 rounded-full bg-emerald-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Without Assistance
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mx-auto h-full max-w-7xl">
        <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="hidden h-full lg:block">
            <div className="sidebar-shell flex h-full flex-col justify-between">
              <div className="space-y-4">
                <div className="rounded-[1.5rem] bg-white/80 p-5 shadow-sm">
                  <p className="badge-soft mb-3">Module progress</p>
                  <h2 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
                    {moduleTitle}
                  </h2>
                </div>

                <div className="section-card card-purple p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                        Emotion
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-[color:var(--color-text-main)]">
                        {currentEmotion}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                        Trial
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-[color:var(--color-text-main)]">
                        {trial} / 3
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                        Completed
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-[color:var(--color-text-main)]">
                        {completedTrials} / 24
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="grid h-full min-h-0 gap-4 lg:grid-cols-2">
            <div className="flex min-h-0 flex-col overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="space-y-4">
                  {leftContent}

                  {previewResult && (
                    <div className="section-card card-sky p-5">
                      <p className="badge-soft mb-3">Preview result</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[1.25rem] bg-white/80 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                            Detected
                          </p>
                          <p className="mt-2 text-base font-extrabold text-[color:var(--color-text-main)]">
                            {previewResult.detectedEmotion}
                          </p>
                        </div>

                        <div className="rounded-[1.25rem] bg-white/80 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                            Score
                          </p>
                          <p className="mt-2 text-base font-extrabold text-[color:var(--color-text-main)]">
                            {previewResult.score} {previewResult.score === 1 ? "✅" : "❌"}
                          </p>
                        </div>

                        <div className="rounded-[1.25rem] bg-white/80 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                            Time Taken
                          </p>
                          <p className="mt-2 text-base font-extrabold text-[color:var(--color-text-main)]">
                            {previewResult.timeTaken} sec
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {lastSavedResult && (
                    <div className="section-card card-mint p-5">
                      <p className="badge-soft mb-3">Last saved trial</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[1.25rem] bg-white/80 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                            Detected
                          </p>
                          <p className="mt-2 text-base font-extrabold text-[color:var(--color-text-main)]">
                            {lastSavedResult.detectedEmotion}
                          </p>
                        </div>

                        <div className="rounded-[1.25rem] bg-white/80 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                            Score
                          </p>
                          <p className="mt-2 text-base font-extrabold text-[color:var(--color-text-main)]">
                            {lastSavedResult.score} {lastSavedResult.score === 1 ? "✅" : "❌"}
                          </p>
                        </div>

                        <div className="rounded-[1.25rem] bg-white/80 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                            Time Taken
                          </p>
                          <p className="mt-2 text-base font-extrabold text-[color:var(--color-text-main)]">
                            {lastSavedResult.timeTaken} sec
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 mt-4 rounded-[1.5rem] bg-white/90 p-3 shadow-[var(--shadow-card)] backdrop-blur-sm">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onDetect}
                    disabled={detecting || savingTrial || showAssistancePrompt}
                    className={`inline-flex min-h-[56px] flex-1 items-center justify-center rounded-full px-5 py-3 text-base font-extrabold text-white shadow-[var(--shadow-card)] transition ${
                      detecting || savingTrial || showAssistancePrompt
                        ? "cursor-not-allowed bg-slate-400"
                        : "bg-blue-500 hover:-translate-y-0.5 hover:bg-blue-600"
                    }`}
                  >
                    {detecting ? "Detecting..." : previewResult ? "Retry Detect" : "Detect"}
                  </button>

                  <button
                    type="button"
                    onClick={onNext}
                    disabled={!previewResult || savingTrial || showAssistancePrompt}
                    className={`inline-flex min-h-[56px] flex-1 items-center justify-center rounded-full px-5 py-3 text-base font-extrabold text-white shadow-[var(--shadow-card)] transition ${
                      !previewResult || savingTrial || showAssistancePrompt
                        ? "cursor-not-allowed bg-slate-400"
                        : "bg-emerald-500 hover:-translate-y-0.5 hover:bg-emerald-600"
                    }`}
                  >
                    {savingTrial ? "Saving..." : "Next Trial"}
                  </button>
                </div>
              </div>
            </div>

            <section className="flex min-h-0 items-center justify-center">
              <div className="relative aspect-[4/3] w-full max-w-5xl overflow-hidden rounded-[1.5rem] border-[3px] border-black bg-black shadow-[var(--shadow-card)]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                />
              </div>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}

export default EmotionModuleShell;