import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const modulesList = [
  "Matching Game",
  "Emotion Mirror Game",
  "Social Story Viewer",
];

const PreTest = () => {
  const { studentId: paramStudentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const studentId = location.state?.studentId || paramStudentId;
  const sessionType = location.state?.sessionType || "pre";
  const isPostTest = sessionType === "post";

  const [duration, setDuration] = useState("");
  const [setting, setSetting] = useState("");
  const [selectedModule, setSelectedModule] = useState(modulesList[0]);
  const [moduleData, setModuleData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleModuleChange = (module) => {
    setSelectedModule(module);
  };

  const handleModuleInput = (field, value) => {
    setModuleData((prev) => ({
      ...prev,
      [selectedModule]: {
        ...prev[selectedModule],
        [field]: value,
      },
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  const goToCurrentModule = async (assessmentIdToUse, sessionTypeToUse) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/modules/assessment-progress/${assessmentIdToUse}`
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch assessment progress");
    }

    const currentModule = Number(data.data.currentModule || 1);

    if (currentModule === 1) {
      navigate(
        `/emotion-cards-intro/${studentId}/${assessmentIdToUse}/${sessionTypeToUse}`
      );
      return;
    }

    if (currentModule === 2) {
      navigate(`/module2/${studentId}/${assessmentIdToUse}/${sessionTypeToUse}`);
      return;
    }

    if (currentModule === 3) {
      navigate(`/module3/${studentId}/${assessmentIdToUse}/${sessionTypeToUse}`);
      return;
    }

    alert("All modules completed.");
  } catch (error) {
    console.error(error);
    alert(error.message || "Failed to resume assessment");
  }
};

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/assessments/pretest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          interventionDuration: duration,
          setting,
          type: sessionType,
          modules: moduleData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to save ${isPostTest ? "post-test" : "pre-test"}`
        );
      }

      alert(
        data.resumed
          ? `${isPostTest ? "Post-Test" : "Pre-Test"} Resumed Successfully!`
          : ` ${isPostTest ? "Post-Test" : "Pre-Test"} Saved Successfully!`
      );

      await goToCurrentModule(data.data._id, data.data.type);
    } catch (error) {
      console.error(error);
      alert(
        error.message || `Error saving ${isPostTest ? "post-test" : "pre-test"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-dvh overflow-hidden px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
      <section className="mx-auto h-full max-w-7xl">
        <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden h-full min-h-0 lg:block">
            <div className="sidebar-shell flex h-full min-h-0 flex-col p-4">
              <div className="flex min-h-0 flex-1 flex-col justify-between gap-4">
                <div className="space-y-4">
                  <div className="section-card card-purple p-3">
                    <p className="mb-2 text-sm font-extrabold text-[color:var(--color-text-main)]">
                      Modules
                    </p>

                    <div className="space-y-2">
                      {modulesList.map((module, index) => {
                        const isActive = selectedModule === module;

                        return (
                          <button
                            key={module}
                            type="button"
                            onClick={() => handleModuleChange(module)}
                            className={`w-full rounded-[1.1rem] px-3 py-2.5 text-left text-sm font-bold transition ${
                              isActive
                                ? "bg-brand-500 text-white shadow-[var(--shadow-soft)]"
                                : "bg-white/80 text-[color:var(--color-text-main)] hover:bg-white"
                            }`}
                          >
                            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[11px] font-extrabold text-brand-700">
                              {index + 1}
                            </span>
                            {module}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="section-card card-mint p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                      Student ID
                    </p>
                    <p className="mt-1.5 text-base font-extrabold text-[color:var(--color-text-main)]">
                      {studentId}
                    </p>

                    <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                      Session Type
                    </p>
                    <p className="mt-1.5 text-sm font-semibold capitalize text-[color:var(--color-text-main)]">
                      {sessionType}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate("/manage-students")}
                    className="btn-secondary w-full py-2.5 text-sm"
                  >
                    ← Back to Students
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex h-full min-h-0 flex-col rounded-[2rem] bg-white/60 p-3 shadow-[var(--shadow-soft)] backdrop-blur-sm lg:p-4">
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => navigate("/manage-students")}
                className="btn-secondary"
              >
                ← Back to Students
              </button>

              <div className="stat-pill">
                <span className="font-bold">ID:</span> {studentId}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="grid min-h-full gap-3 content-start">
                <div className="grid gap-3 xl:grid-cols-2">
                  <div className="page-card p-4">
                    <p className="badge-pink mb-2">Assessment overview</p>
                    <h2 className="section-title">
                      {isPostTest ? "Post-Test Assessment" : "Pre-Test Assessment"}
                    </h2>
                    <p className="section-subtitle">
                      Fill in the details below, then continue to the selected
                      module.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] bg-brand-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-brand-700">
                          Student ID
                        </p>
                        <p className="mt-2 text-base font-extrabold text-[color:var(--color-text-main)]">
                          {studentId}
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] bg-pink-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-pink-700">
                          Session
                        </p>
                        <p className="mt-2 text-base font-extrabold capitalize text-[color:var(--color-text-main)]">
                          {sessionType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="section-card card-yellow p-4">
                    <p className="badge-soft mb-2">General information</p>
                    <h3 className="text-lg font-extrabold text-[color:var(--color-text-main)]">
                      Assessment details
                    </h3>

                    <div className="mt-4 grid gap-3">
                      <div>
                        <label className="input-label">Intervention Duration</label>
                        <input
                          type="text"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="e.g., 5 weeks (25 sessions)"
                          className="input-field py-2.5"
                        />
                      </div>

                      <div>
                        <label className="input-label">Setting</label>
                        <input
                          type="text"
                          value={setting}
                          onChange={(e) => setSetting(e.target.value)}
                          placeholder="e.g., Clinic + Home"
                          className="input-field py-2.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                  <div className="section-card card-pink p-4">
                    <p className="badge-pink mb-2">Current module</p>
                    <h3 className="text-lg font-extrabold text-[color:var(--color-text-main)]">
                      {selectedModule}
                    </h3>

                    <div className="mt-4 grid gap-3">
                      <div>
                        <label className="input-label">Date</label>
                        <input
                          type="date"
                          value={today}
                          disabled
                          className="input-field cursor-not-allowed bg-white/70 py-2.5 text-[color:var(--color-text-soft)]"
                        />
                      </div>

                      <div>
                        <label className="input-label">Assessor</label>
                        <input
                          type="text"
                          value={moduleData[selectedModule]?.assessor || ""}
                          onChange={(e) => handleModuleInput("assessor", e.target.value)}
                          placeholder="Enter assessor name"
                          className="input-field py-2.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="page-card flex flex-col justify-between p-4">
                    <div>
                      <p className="badge-soft mb-2">Next step</p>
                      <h3 className="text-lg font-extrabold text-[color:var(--color-text-main)]">
                        Continue to modules
                      </h3>
                      <p className="mt-2 text-sm leading-5 text-[color:var(--color-text-soft)]">
                        Save and continue to the active test flow.
                      </p>
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className={`mt-4 inline-flex min-h-[56px] w-full items-center justify-center rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-[var(--shadow-card)] transition ${
                        loading
                          ? "cursor-not-allowed bg-slate-400"
                          : "bg-brand-500 hover:-translate-y-0.5 hover:bg-brand-600"
                      }`}
                    >
                      {loading
                        ? "Saving..."
                        : isPostTest
                        ? "Go to Post-Test Modules"
                        : "Go to Pre-Test Modules"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default PreTest;