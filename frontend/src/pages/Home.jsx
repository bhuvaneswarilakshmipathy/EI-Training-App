import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="relative h-dvh overflow-hidden bg-[linear-gradient(135deg,#f6eefe_0%,#eaf6ff_35%,#fff7d6_100%)] px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-pink-300/35 blur-3xl animate-float-slow motion-reduce:animate-none" />
        <div className="absolute left-1/3 top-0 h-52 w-52 rounded-full bg-sky-300/30 blur-3xl animate-float-mid motion-reduce:animate-none" />
        <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-yellow-300/30 blur-3xl animate-float-slow motion-reduce:animate-none" />
        <div className="absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-violet-300/25 blur-3xl animate-glow-soft motion-reduce:animate-none" />
      </div>

      <section className="relative z-10 mx-auto grid h-full max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="sidebar-shell hidden h-full overflow-hidden border border-white/50 bg-[linear-gradient(180deg,#dcc7ff_0%,#dff1ff_100%)] lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-4">
            <div className="rounded-[1.75rem] bg-white/75 p-4 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3">
  <div className="relative h-20 w-20 shrink-0">
    <div className="absolute left-3 top-2 h-5 w-5 rounded-full bg-slate-900" />
    <div className="absolute right-3 top-2 h-5 w-5 rounded-full bg-slate-900" />

    <div className="absolute left-1/2 top-5 h-11 w-11 -translate-x-1/2 rounded-full bg-white shadow-[0_8px_18px_rgba(148,163,184,0.16)]">
      <div className="absolute left-2 top-3 h-4 w-3 rotate-[25deg] rounded-full bg-slate-900" />
      <div className="absolute right-2 top-3 h-4 w-3 -rotate-[25deg] rounded-full bg-slate-900" />

      <div className="absolute left-[11px] top-[17px] h-1.5 w-1.5 rounded-full bg-white" />
      <div className="absolute right-[11px] top-[17px] h-1.5 w-1.5 rounded-full bg-white" />

      <div className="absolute left-[13px] top-[18px] h-1.5 w-1.5 rounded-full bg-slate-900" />
      <div className="absolute right-[13px] top-[18px] h-1.5 w-1.5 rounded-full bg-slate-900" />

      <div className="absolute left-1/2 top-6 h-2.5 w-3 -translate-x-1/2 rounded-full bg-slate-800" />
      <div className="absolute left-1/2 top-[29px] h-3 w-[2px] -translate-x-1/2 bg-slate-400/70" />
      <div className="absolute left-[16px] top-[30px] h-3 w-3 rounded-full border-b-2 border-r-2 border-slate-500/70 rotate-45" />
      <div className="absolute right-[16px] top-[30px] h-3 w-3 rounded-full border-b-2 border-l-2 border-slate-500/70 -rotate-45" />
    </div>

    <div className="absolute left-1/2 top-12 h-8 w-12 -translate-x-1/2 rounded-full bg-white shadow-sm animate-[pandaBob_2.8s_ease-in-out_infinite]">
      <div className="absolute left-1.5 top-1 h-5 w-2.5 rounded-full bg-slate-900" />
      <div className="absolute right-1.5 top-1 h-5 w-2.5 rounded-full bg-slate-900" />
      <div className="absolute left-1/2 top-2 h-4 w-5 -translate-x-1/2 rounded-full bg-slate-900/90" />
    </div>

    <div className="absolute bottom-1 left-1/2 h-3 w-12 -translate-x-1/2 rounded-full bg-slate-300/40 blur-sm" />
  </div>

  <div className="min-w-0">
    <p className="text-kid-heading text-xl text-[color:var(--color-text-main)]">
      Your Panda Buddy
    </p>
    <p className="mt-1 text-sm leading-5 text-[color:var(--color-text-soft)]">
      Hi all!!!
    </p>
  </div>
</div>
            </div>

            <div className="section-card border-white/70 bg-[linear-gradient(180deg,#f3ddff_0%,#efe8ff_100%)] shadow-[0_14px_34px_rgba(168,85,247,0.14)]">
              <p className="badge-soft mb-3 bg-white/80">Welcome</p>
              <h2 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
                EI Training System
              </h2>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-[color:var(--color-text-soft)]">
                Learning emotions helps autistic children communicate better, build social connections, and grow with confidence.

              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white/80 p-4 shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffd6ea_0%,#ffeaa7_100%)] text-xl shadow-sm">
                
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-[color:var(--color-text-main)]">
                  Hurrayyyyy!!!
                </p>
                <p className="truncate text-xs text-[color:var(--color-text-soft)]">
                  Let's Learn
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="content-shell flex h-full min-h-0 flex-col overflow-hidden border border-white/60 bg-white/55 backdrop-blur-xl">
          <div className="mb-3 lg:hidden">
            <div className="min-w-0">
              <h1 className="text-kid-heading truncate text-2xl text-[color:var(--color-text-main)] sm:text-3xl">
                EI Training System
              </h1>
              <p className="mt-1 line-clamp-2 text-sm text-[color:var(--color-text-soft)]">
                 Learning emotions helps autistic children communicate better, build social connections, and grow with confidence.
              </p>
            </div>
          </div>

          <div className="page-card flex h-full min-h-0 flex-col overflow-hidden border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,251,255,0.88)_100%)]">
            <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_280px]">
              <div className="flex min-h-0 flex-col justify-between gap-4">
                <div>
                  <p className="mb-3 inline-flex rounded-full bg-pink-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-pink-600 shadow-sm">
                    Kids-friendly learning space
                  </p>

                  <h2 className="text-kid-heading text-3xl leading-tight text-[color:var(--color-text-main)] sm:text-4xl xl:text-5xl">
                    EI Training System
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--color-text-soft)] sm:text-base">
                    This system helps children learn and recognize emotions through structured activities and assessments.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="group flex flex-col justify-between rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,#dff4ff_0%,#ccecff_100%)] p-5 shadow-[0_12px_30px_rgba(59,130,246,0.12)] transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(59,130,246,0.18)]">
                    <div>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-2xl shadow-md transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                        ➕
                      </div>
                      <h3 className="text-lg font-extrabold text-[color:var(--color-text-main)] sm:text-xl">
                        Add Students
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                        Add learner profiles quickly with a friendly and simple
                        setup flow.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition hover:scale-[1.02] hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-200 sm:w-fit"
                      onClick={() => navigate("/add-student")}
                    >
                      ➕ Add Students
                    </button>
                  </div>

                  <div className="group flex flex-col justify-between rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,#dcfce7_0%,#c8f7da_100%)] p-5 shadow-[0_12px_30px_rgba(16,185,129,0.12)] transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(16,185,129,0.18)]">
                    <div>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-2xl shadow-md transition duration-300 group-hover:scale-110 group-hover:-rotate-3">
                        
                      </div>
                      <h3 className="text-lg font-extrabold text-[color:var(--color-text-main)] sm:text-xl">
                        Manage Students
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                        Open student records, review progress, and continue
                        learning sessions smoothly.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200 transition hover:scale-[1.02] hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:w-fit"
                      onClick={() => navigate("/manage-students")}
                    >
                      Manage Students
                    </button>
                  </div>
                </div>
              </div>

              <aside className="hidden h-full min-h-0 xl:grid xl:grid-rows-3 xl:gap-4">
                <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,#fff4bf_0%,#ffe996_100%)] p-5 shadow-[0_12px_28px_rgba(234,179,8,0.14)] transition duration-300 hover:-translate-y-1">
                  <p className="mb-3 inline-flex rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-amber-700">
                    Quick access
                  </p>
                  <h3 className="text-lg font-extrabold text-[color:var(--color-text-main)]">
                    Start with confidence
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    Large buttons and bright cards make the first screen feel
                    joyful and simple.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,#ffe3f1_0%,#ffd3ea_100%)] p-5 shadow-[0_12px_28px_rgba(236,72,153,0.14)] transition duration-300 hover:-translate-y-1">
                  <p className="mb-3 inline-flex rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-pink-600">
                    Friendly design
                  </p>
                  <h3 className="text-lg font-extrabold text-[color:var(--color-text-main)]">
                    Bright and cheerful UI
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    Pastel colors, rounded shapes, and soft shadows create a
                    gentle educational feel.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,#efe4ff_0%,#e6d8ff_100%)] p-5 shadow-[0_12px_28px_rgba(139,92,246,0.14)] transition duration-300 hover:-translate-y-1">
                  <p className="mb-3 inline-flex rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-violet-600">
                    Responsive layout
                  </p>
                  <h3 className="text-lg font-extrabold text-[color:var(--color-text-main)]">
                    Dashboard structure
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                    The layout stays polished and app-like while keeping the
                    interface easy to scan.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Home;