import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateStudentReportPdf } from "../utils/generateStudentReportPdf";

function ManageStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  const handleDownloadReport = async (student) => {
    try {
      const studentId = student.childId || student._id;

      const res = await fetch(
        `http://localhost:5000/api/assessments/student-report/${studentId}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate report");
      }

      generateStudentReportPdf(student, data.data);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to download report");
    }
  };

  const getStudentAvatar = (student) =>
    student.gender === "Female" ? "👧" : "👦";

  const selectedStudentId =
    selectedStudent?.childId || selectedStudent?._id || "";

  if (selectedStudent) {
    return (
      <main className="h-dvh overflow-hidden px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
        <section className="mx-auto flex h-full max-w-7xl flex-col gap-3">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-white/75 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-sm">
            <div className="min-w-0">
              <p className="badge-pink mb-1">Student profile</p>
              <h1 className="truncate text-kid-heading text-lg text-[color:var(--color-text-main)] sm:text-xl">
                {selectedStudent.name}
              </h1>
              <p className="mt-1 truncate text-[11px] text-[color:var(--color-text-soft)] sm:text-xs">
                ID: {selectedStudentId}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="btn-secondary px-4 py-2.5 text-xs sm:text-sm"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn-soft px-4 py-2.5 text-xs sm:text-sm"
              >
                Home
              </button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1.5fr)_340px]">
            <div className="flex min-h-0 flex-col gap-3">
              <div className="section-card card-sky shrink-0 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffe7f2_0%,#e5f3ff_100%)] text-3xl shadow-sm">
                    {getStudentAvatar(selectedStudent)}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-extrabold text-[color:var(--color-text-main)] sm:text-lg">
                      {selectedStudent.name}
                    </h2>
                    <p className="mt-1 truncate text-xs text-[color:var(--color-text-soft)]">
                      Student ID: {selectedStudentId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-2">
                <div className="section-card card-purple p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-violet-600">
                    Age
                  </p>
                  <p className="mt-1 text-base font-semibold text-[color:var(--color-text-main)] sm:text-lg">
                    {selectedStudent.age || "-"}
                  </p>
                </div>

                <div className="section-card card-mint p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                    Gender
                  </p>
                  <p className="mt-1 text-base font-semibold text-[color:var(--color-text-main)] sm:text-lg">
                    {selectedStudent.gender || "-"}
                  </p>
                </div>

                <div className="section-card card-yellow p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600">
                    Severity
                  </p>
                  <p className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-[color:var(--color-text-main)] sm:text-lg">
                    {selectedStudent.severity || "-"}
                  </p>
                </div>

                <div className="section-card card-sky p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-sky-600">
                    Communication
                  </p>
                  <p className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-[color:var(--color-text-main)] sm:text-lg">
                    {selectedStudent.communication || "-"}
                  </p>
                </div>

                <div className="section-card card-pink p-3 md:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-pink-600">
                    IEP Reference
                  </p>
                  <p className="mt-1 line-clamp-3 text-base font-semibold leading-6 text-[color:var(--color-text-main)] sm:text-lg">
                    {selectedStudent.iep || "-"}
                  </p>
                </div>
              </div>
            </div>

            <aside className="section-card card-yellow flex h-full min-h-0 flex-col justify-between p-5">
              <div>
                <p className="badge-soft mb-2">Assessment actions</p>
                <h2 className="text-kid-heading text-xl text-[color:var(--color-text-main)]">
                  Start or Continue
                </h2>
                <p className="mt-2 text-sm leading-5 text-[color:var(--color-text-soft)]">
                  Choose the next step for this student.
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  className="flex min-h-[64px] w-full items-center justify-center rounded-[1.5rem] bg-brand-500 px-6 py-4 text-base font-extrabold text-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:bg-brand-600"
                  onClick={() =>
                    navigate(`/pretest/${selectedStudentId}`, {
                      state: {
                        studentId: selectedStudentId,
                        sessionType: "pre",
                      },
                    })
                  }
                >
                  Pre-Test
                </button>

                <button
                  type="button"
                  className="flex min-h-[64px] w-full items-center justify-center rounded-[1.5rem] bg-white px-6 py-4 text-base font-extrabold text-brand-700 ring-1 ring-brand-200 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-brand-50"
                  onClick={() =>
                    navigate(`/pretest/${selectedStudentId}`, {
                      state: {
                        studentId: selectedStudentId,
                        sessionType: "post",
                      },
                    })
                  }
                >
                  Post-Test
                </button>

                <button
                  type="button"
                  className="flex min-h-[64px] w-full items-center justify-center rounded-[1.5rem] bg-pink-400 px-6 py-4 text-base font-extrabold text-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-pink-500"
                  onClick={() => handleDownloadReport(selectedStudent)}
                >
                  Download Report
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-3 py-3 lg:h-dvh lg:px-5 lg:py-5">
      <section className="mx-auto h-full max-w-7xl">
        <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="sidebar-shell hidden h-full lg:flex lg:flex-col lg:justify-between">
            <div className="space-y-4">
              <div className="rounded-[1.75rem] bg-white/75 p-5 shadow-sm backdrop-blur-sm">
                <p className="badge-soft mb-3">Student Dashboard</p>
                <h1 className="text-kid-heading text-3xl text-[color:var(--color-text-main)]">
                  Manage Students
                </h1>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-soft)]">
                  Browse student profiles, open assessments, and download
                  progress reports from one friendly dashboard.
                </p>
              </div>

              <div className="section-card card-sky">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-xl shadow-sm">
                  
                </div>
                <h2 className="text-lg font-extrabold text-[color:var(--color-text-main)]">
                  All learners in one place
                </h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                  Select a student card to view profile details and start the
                  next step.
                </p>
              </div>

              <div className="section-card card-pink">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-xl shadow-sm">
                  
                </div>
                <h2 className="text-lg font-extrabold text-[color:var(--color-text-main)]">
                  Quick actions
                </h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                  Open pre-test, post-test, or download a result report with a
                  single click.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn-secondary w-full"
              >
                ← Go to Home
              </button>

              <button
                type="button"
                onClick={() => navigate("/add-student")}
                className="btn-soft w-full"
              >
                ➕ Add Student
              </button>
            </div>
          </aside>

          <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] bg-white/60 p-3 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-4 lg:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn-secondary"
              >
                ← Go to Home
              </button>

              <button
                type="button"
                onClick={() => navigate("/add-student")}
                className="btn-soft"
              >
                ➕ Add Student
              </button>
            </div>

            <div className="page-card flex h-full min-h-0 flex-col overflow-hidden p-4 sm:p-5">
              <div className="mb-5 shrink-0 border-b border-brand-100 pb-4">
                <p className="badge-pink mb-3">Student list</p>
                <h2 className="text-kid-heading text-3xl text-[color:var(--color-text-main)]">
                  Manage Students
                </h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                  Choose a learner card to open the profile, review details, and
                  continue assessments.
                </p>
              </div>

              {students.length === 0 ? (
                <div className="empty-state flex-1">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl shadow-sm">
                    🧸
                  </div>
                  <h3 className="text-xl font-extrabold text-[color:var(--color-text-main)]">
                    No students yet
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[color:var(--color-text-soft)]">
                    Add your first learner profile to start pre-tests,
                    post-tests, and reports.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/add-student")}
                    className="btn-primary mt-5"
                  >
                    ➕ Add Student
                  </button>
                </div>
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {students.map((student) => (
                      <button
                        key={student._id}
                        type="button"
                        onClick={() => setSelectedStudent(student)}
                        className="group rounded-[1.4rem] border border-[color:var(--color-border-soft)] bg-white p-3 text-left shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffe7f2_0%,#e5f3ff_100%)] text-2xl shadow-sm transition duration-200 group-hover:scale-105">
                            {getStudentAvatar(student)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-extrabold text-[color:var(--color-text-main)]">
                              {student.name}
                            </h3>
                            <p className="truncate text-xs text-[color:var(--color-text-soft)]">
                              ID: {student.childId || student._id}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-xl bg-brand-50 px-2.5 py-2">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-brand-600">
                              Age
                            </p>
                            <p className="mt-0.5 text-xs font-semibold text-[color:var(--color-text-main)]">
                              {student.age || "-"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-pink-50 px-2.5 py-2">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-pink-600">
                              Gender
                            </p>
                            <p className="mt-0.5 text-xs font-semibold text-[color:var(--color-text-main)]">
                              {student.gender || "-"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="inline-flex rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-bold text-brand-700">
                            View profile
                          </span>
                          <span className="text-xs font-semibold text-[color:var(--color-text-soft)] transition group-hover:text-brand-600">
                            →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default ManageStudents;