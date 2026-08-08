import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function ModuleResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const studentId = params.studentId || location.state?.studentId;
  const assessmentId = params.assessmentId || location.state?.assessmentId;
  const sessionType = params.sessionType || location.state?.sessionType;

  const routePath = location.pathname;
  const moduleId = params.moduleId
    ? Number(params.moduleId)
    : routePath.includes("module1-result")
    ? 1
    : routePath.includes("module2-result")
    ? 2
    : 3;

  const moduleName =
    location.state?.moduleName ||
    (moduleId === 1
      ? "Matching Game"
      : moduleId === 2
      ? "Emotion Mirror Game"
      : "Social Story");

  const [results, setResults] = useState(location.state?.results || []);
  const [loading, setLoading] = useState(!location.state?.results);

  useEffect(() => {
    if (results.length || !assessmentId || !studentId || !sessionType) return;

    const loadModuleResult = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/modules/result?assessmentId=${assessmentId}&studentId=${studentId}&sessionType=${sessionType}&moduleId=${moduleId}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load module result");
        }

        setResults(data.data?.trials || []);
      } catch (error) {
        console.error(error);
        alert("Failed to load result page");
      } finally {
        setLoading(false);
      }
    };

    loadModuleResult();
  }, [results.length, assessmentId, studentId, sessionType, moduleId]);

  const summary = useMemo(() => {
    if (!results.length) {
      return {
        totalTrials: 0,
        totalCorrect: 0,
        averageScore: 0,
        totalTime: 0,
        emotionStats: [],
        strongestEmotions: [],
        weakestEmotions: [],
        improvementAreas: [],
      };
    }

    const grouped = results.reduce((acc, trial) => {
      const key = trial.emotion;

      if (!acc[key]) {
        acc[key] = {
          emotion: key,
          totalTrials: 0,
          correctCount: 0,
          wrongCount: 0,
          totalTime: 0,
        };
      }

      acc[key].totalTrials += 1;
      acc[key].correctCount += trial.score === 1 ? 1 : 0;
      acc[key].wrongCount += trial.score === 0 ? 1 : 0;
      acc[key].totalTime += Number(trial.timeTaken || 0);

      return acc;
    }, {});

    const emotionStats = Object.values(grouped)
      .map((item) => ({
        ...item,
        averageTime: Number((item.totalTime / item.totalTrials).toFixed(2)),
      }))
      .sort((a, b) => a.emotion.localeCompare(b.emotion));

    const totalTrials = results.length;
    const totalCorrect = results.filter((r) => r.score === 1).length;
    const totalTime = Number(
      results.reduce((sum, r) => sum + Number(r.timeTaken || 0), 0).toFixed(2)
    );
    const averageScore = Number(((totalCorrect / totalTrials) * 100).toFixed(2));

    const strongestEmotions = emotionStats
      .filter((item) => item.correctCount >= 2)
      .map((item) => item.emotion);

    const weakestEmotions = emotionStats
      .filter((item) => item.correctCount <= 1)
      .map((item) => item.emotion);

    const improvementAreas = [...weakestEmotions];

    return {
      totalTrials,
      totalCorrect,
      averageScore,
      totalTime,
      emotionStats,
      strongestEmotions,
      weakestEmotions,
      improvementAreas,
    };
  }, [results]);

  const handleNext = () => {
    if (moduleId === 1) {
      navigate(`/module2/${studentId}/${assessmentId}/${sessionType}`);
    } else if (moduleId === 2) {
      navigate(`/module3/${studentId}/${assessmentId}/${sessionType}`);
    } else {
      navigate(`/pretest-result/${studentId}/${assessmentId}/${sessionType}`);
    }
  };

  const nextLabel =
    moduleId === 1 ? "Go to Module 2" : moduleId === 2 ? "Go to Module 3" : "Finish";

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl">
          <div className="page-card text-center">
            <p className="badge-soft mb-3">Loading</p>
            <h2 className="text-kid-heading text-3xl text-[color:var(--color-text-main)]">
              Loading result...
            </h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-soft)]">
              Please wait while the module summary is prepared.
            </p>
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
                  <p className="badge-pink mb-3">Module result</p>
                  <h1 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
                    {moduleName}
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    Review the learner’s performance, strongest emotions, and
                    areas that may need more support.
                  </p>
                </div>

                <div className="section-card card-sky p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                    Student ID
                  </p>
                  <p className="mt-2 break-all text-sm font-bold text-[color:var(--color-text-main)]">
                    {studentId || "-"}
                  </p>
                </div>

                <div className="section-card card-purple p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
                    Session Type
                  </p>
                  <p className="mt-2 text-sm font-bold capitalize text-[color:var(--color-text-main)]">
                    {sessionType || "-"}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary w-full justify-center"
                  >
                    {nextLabel}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/manage-students")}
                    className="btn-secondary w-full justify-center"
                  >
                    Back to Students
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="page-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="badge-soft mb-3">Performance summary</p>
                  <h2 className="text-kid-heading text-3xl text-[color:var(--color-text-main)]">
                    {moduleName} Result
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    This page summarizes trial accuracy, timing, and emotion-wise
                    performance for the current module.
                  </p>
                </div>

                <div className="stat-pill">
                  <span></span>
                  <span>{summary.averageScore}% average score</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="section-card card-pink p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-pink-600">
                  Total Trials
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[color:var(--color-text-main)]">
                  {summary.totalTrials}
                </p>
              </div>

              <div className="section-card card-mint p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                  Total Correct
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[color:var(--color-text-main)]">
                  {summary.totalCorrect}
                </p>
              </div>

              <div className="section-card card-yellow p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                  Average Score
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[color:var(--color-text-main)]">
                  {summary.averageScore}%
                </p>
              </div>

              <div className="section-card card-sky p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
                  Total Time
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[color:var(--color-text-main)]">
                  {summary.totalTime}s
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="result-card card-mint">
                <p className="badge-mint mb-3">Strengths</p>
                <h3 className="text-xl font-extrabold text-[color:var(--color-text-main)]">
                  Strongest Emotions
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {summary.strongestEmotions.length ? (
                    summary.strongestEmotions.map((emotion) => (
                      <span
                        key={emotion}
                        className="inline-flex rounded-full bg-white px-3 py-1.5 text-sm font-bold text-emerald-700 shadow-sm"
                      >
                        {emotion}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[color:var(--color-text-soft)]">-</p>
                  )}
                </div>
              </div>

              <div className="result-card card-pink">
                <p className="badge-pink mb-3">Needs support</p>
                <h3 className="text-xl font-extrabold text-[color:var(--color-text-main)]">
                  Weakest Emotions
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {summary.weakestEmotions.length ? (
                    summary.weakestEmotions.map((emotion) => (
                      <span
                        key={emotion}
                        className="inline-flex rounded-full bg-white px-3 py-1.5 text-sm font-bold text-pink-700 shadow-sm"
                      >
                        {emotion}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[color:var(--color-text-soft)]">-</p>
                  )}
                </div>
              </div>

              <div className="result-card card-yellow">
                <p className="badge-soft mb-3">Practice focus</p>
                <h3 className="text-xl font-extrabold text-[color:var(--color-text-main)]">
                  Improvement Areas
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {summary.improvementAreas.length ? (
                    summary.improvementAreas.map((emotion) => (
                      <span
                        key={emotion}
                        className="inline-flex rounded-full bg-white px-3 py-1.5 text-sm font-bold text-amber-700 shadow-sm"
                      >
                        {emotion}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[color:var(--color-text-soft)]">-</p>
                  )}
                </div>
              </div>
            </div>

            <div className="page-card overflow-hidden p-0">
              <div className="border-b border-brand-100 px-5 py-4 sm:px-6">
                <p className="badge-soft mb-3">Emotion-wise breakdown</p>
                <h3 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
                  Trial Details
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                  Review the number of trials, correct responses, incorrect
                  responses, and average time for each emotion.
                </p>
              </div>

              {summary.emotionStats.length === 0 ? (
                <div className="empty-state rounded-none border-0 shadow-none">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl shadow-sm">
                    
                  </div>
                  <h3 className="text-xl font-extrabold text-[color:var(--color-text-main)]">
                    No result details available
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[color:var(--color-text-soft)]">
                    The module summary is empty right now.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-brand-50">
                      <tr className="text-left">
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          Emotion
                        </th>
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          Trials
                        </th>
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          Correct
                        </th>
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          Wrong
                        </th>
                        <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-brand-700 sm:px-6">
                          Avg Time
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {summary.emotionStats.map((item, index) => (
                        <tr
                          key={item.emotion}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-brand-50/40"
                          }
                        >
                          <td className="px-5 py-4 text-sm font-bold text-[color:var(--color-text-main)] sm:px-6">
                            {item.emotion}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-[color:var(--color-text-soft)] sm:px-6">
                            {item.totalTrials}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-emerald-700 sm:px-6">
                            {item.correctCount}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-pink-600 sm:px-6">
                            {item.wrongCount}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-[color:var(--color-text-soft)] sm:px-6">
                            {item.averageTime}s
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleNext} className="btn-primary">
                {nextLabel}
              </button>

              <button
                type="button"
                onClick={() => navigate("/manage-students")}
                className="btn-secondary"
              >
                Back to Students
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ModuleResultPage;