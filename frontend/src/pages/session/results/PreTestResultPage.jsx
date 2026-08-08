import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PreTestResultPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { studentId, assessmentId, sessionType } = useParams();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTimeTaken = (seconds) => {
    const totalSeconds = Math.floor(Number(seconds) || 0);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  useEffect(() => {
    const fetchConsolidatedResult = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/modules/consolidated-result?assessmentId=${assessmentId}&studentId=${studentId}&sessionType=${sessionType}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load consolidated pre-test result");
        }

        const modulesRaw = data.data || [];

        const uniqueModules = Object.values(
          modulesRaw.reduce((acc, module) => {
            const key = module.moduleId;

            if (!acc[key]) {
              acc[key] = module;
              return acc;
            }

            const currentTrials = Number(acc[key].totalTrialsCompleted || 0);
            const nextTrials = Number(module.totalTrialsCompleted || 0);

            const currentCompleted = acc[key].status === "completed";
            const nextCompleted = module.status === "completed";

            if (
              nextCompleted ||
              (!currentCompleted && nextTrials > currentTrials)
            ) {
              acc[key] = module;
            }

            return acc;
          }, {})
        );

        setModules(uniqueModules);
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to load consolidated pre-test result");
      } finally {
        setLoading(false);
      }
    };

    fetchConsolidatedResult();
  }, [assessmentId, studentId, sessionType]);

  const summary = useMemo(() => {
    const allTrials = modules.flatMap((module) => module.trials || []);

    const totalTrials = allTrials.length;
    const totalCorrect = allTrials.filter((trial) => Number(trial.score) > 0).length;
    const totalScore = allTrials.reduce((sum, trial) => sum + Number(trial.score || 0), 0);
    const averageScore = totalTrials > 0 ? (totalScore / totalTrials).toFixed(2) : "0.00";
    const totalTime = allTrials.reduce((sum, trial) => sum + Number(trial.timeTaken || 0), 0);

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
      avgTime: item.trials > 0 ? (item.totalTime / item.trials).toFixed(2) : "0.00",
      accuracy: item.trials > 0 ? (item.correct / item.trials) * 100 : 0,
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
      averageScore,
      totalTime,
      emotionStats,
      strongestEmotions,
      weakestEmotions,
    };
  }, [modules]);

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl">
          <div className="page-card text-center">
            <p className="badge-soft mb-3">{t("loadingResult")}</p>
            <h2 className="text-kid-heading text-3xl text-[color:var(--color-text-main)]">
              {t("loadingResult")}
            </h2>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="sidebar-shell lg:sticky lg:top-6 lg:h-auto">
              <div className="space-y-4">
                <div className="rounded-[1.5rem] bg-white/80 p-5 shadow-sm">
                  <p className="badge-pink mb-3">{t("result")}</p>
                  <h1 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
                    {t("preTest")} {t("result")}
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    Consolidated performance overview across all module activities.
                  </p>
                </div>

                <div className="section-card card-sky p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                    {t("studentId")}
                  </p>
                  <p className="mt-2 break-all text-sm font-bold text-[color:var(--color-text-main)]">
                    {studentId}
                  </p>
                </div>

                <div className="section-card card-purple p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
                    {t("sessionType")}
                  </p>
                  <p className="mt-2 text-sm font-bold capitalize text-[color:var(--color-text-main)]">
                    {sessionType}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/manage-students")}
                  className="btn-secondary w-full justify-center"
                >
                  {t("backToAllStudents")}
                </button>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="page-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="badge-soft mb-3">{t("result")}</p>
                  <h2 className="text-kid-heading text-3xl text-[color:var(--color-text-main)]">
                    {t("preTest")} {t("result")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    A combined summary of trials, score, timing, and emotion-wise
                    performance across all completed modules.
                  </p>
                </div>

                <div className="stat-pill">
                  <span></span>
                  <span>
                    {summary.averageScore}% {t("averageScore")}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="section-card card-pink p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-pink-600">
                  {t("totalTrials")}
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[color:var(--color-text-main)]">
                  {summary.totalTrials}
                </p>
              </div>

              <div className="section-card card-mint p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                  {t("totalCorrect")}
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[color:var(--color-text-main)]">
                  {summary.totalCorrect}
                </p>
              </div>

              <div className="section-card card-yellow p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                  {t("averageScore")}
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[color:var(--color-text-main)]">
                  {summary.averageScore}%
                </p>
              </div>

              <div className="section-card card-sky p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
                  {t("totalTime")}
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[color:var(--color-text-main)]">
                  {formatTimeTaken(summary.totalTime)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="result-card card-mint">
                <p className="badge-mint mb-3">{t("strongestEmotion")}</p>
                <h3 className="text-xl font-extrabold text-[color:var(--color-text-main)]">
                  {t("strongestEmotion")}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {summary.strongestEmotions.length ? (
                    summary.strongestEmotions.map((emotion) => (
                      <span
                        key={emotion}
                        className="inline-flex rounded-full bg-white px-3 py-1.5 text-sm font-bold text-emerald-700 shadow-sm"
                      >
                        {t(`emotions.${emotion}`)}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[color:var(--color-text-soft)]">-</p>
                  )}
                </div>
              </div>

              <div className="result-card card-pink">
                <p className="badge-pink mb-3">{t("weakestEmotion")}</p>
                <h3 className="text-xl font-extrabold text-[color:var(--color-text-main)]">
                  {t("weakestEmotion")}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {summary.weakestEmotions.length ? (
                    summary.weakestEmotions.map((emotion) => (
                      <span
                        key={emotion}
                        className="inline-flex rounded-full bg-white px-3 py-1.5 text-sm font-bold text-pink-700 shadow-sm"
                      >
                        {t(`emotions.${emotion}`)}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[color:var(--color-text-soft)]">-</p>
                  )}
                </div>
              </div>
            </div>

            <div className="page-card">
              <div className="mb-5">
                <p className="badge-soft mb-3">{t("modules")}</p>
                <h3 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
                  {t("modules")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                  Module-wise overview of completion and average performance.
                </p>
              </div>

              {modules.length === 0 ? (
                <div className="empty-state">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl shadow-sm">
                    
                  </div>
                  <h3 className="text-xl font-extrabold text-[color:var(--color-text-main)]">
                    {t("modules")}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    No module summary is available yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {modules.map((module) => (
                    <div key={module._id} className="student-card bg-white">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="badge-soft">
                          {module.moduleId === 1
                            ? t("module1Title")
                            : module.moduleId === 2
                            ? t("module2Title")
                            : t("module3Title")}
                        </span>

                        <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
                          {module.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-2xl bg-brand-50 px-4 py-3">
                          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
                            {t("totalTrials")}
                          </p>
                          <p className="mt-1 text-lg font-extrabold text-[color:var(--color-text-main)]">
                            {module.totalTrialsCompleted || 0}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-pink-50 px-4 py-3">
                          <p className="text-xs font-bold uppercase tracking-wide text-pink-600">
                            {t("averageScore")}
                          </p>
                          <p className="mt-1 text-lg font-extrabold text-[color:var(--color-text-main)]">
                            {Number(module.averageScore || 0).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="page-card overflow-hidden p-0">
              <div className="border-b border-brand-100 px-5 py-4 sm:px-6">
                <p className="badge-soft mb-3">{t("result")}</p>
                <h3 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
                  {t("result")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                  Emotion-wise consolidated performance across all modules.
                </p>
              </div>

              {summary.emotionStats.length === 0 ? (
                <div className="empty-state rounded-none border-0 shadow-none">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl shadow-sm">
                    
                  </div>
                  <h3 className="text-xl font-extrabold text-[color:var(--color-text-main)]">
                    {t("result")}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    No emotion-wise result is available yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-brand-50">
                      <tr className="text-left">
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          {t("emotion")}
                        </th>
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          {t("trials")}
                        </th>
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          {t("correct")}
                        </th>
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          {t("wrong")}
                        </th>
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          {t("avgTime")}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {summary.emotionStats.map((item, index) => (
                        <tr
                          key={item.emotion}
                          className={index % 2 === 0 ? "bg-white" : "bg-brand-50/40"}
                        >
                          <td className="px-5 py-4 text-sm font-bold text-[color:var(--color-text-main)] sm:px-6">
                            {t(`emotions.${item.emotion}`)}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-[color:var(--color-text-soft)] sm:px-6">
                            {item.trials}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-emerald-700 sm:px-6">
                            {item.correct}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-pink-600 sm:px-6">
                            {item.wrong}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-[color:var(--color-text-soft)] sm:px-6">
                            {formatTimeTaken(item.avgTime)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => navigate("/manage-students")}
                className="btn-primary"
              >
                {t("backToAllStudents")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PreTestResultPage;