import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AddStudent() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    childId: "",
    name: "",
    age: "",
    gender: "",
    severity: "",
    communication: "",
    iep: "",
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let error = "";

    if (name === "childId" && !/^[0-9]*$/.test(value)) {
      error = t("enterNumbersOnly");
    }

    if (name === "name" && !/^[a-zA-Z\s]*$/.test(value)) {
      error = t("enterLettersOnly");
    }

    if (name === "age" && !/^[0-9\s]*$/.test(value)) {
      error = t("enterValidAge");
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const error = validate(name, value);

    setErrors({ ...errors, [name]: error });

    if (error) return;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    Object.keys(form).forEach((key) => {
      newErrors[key] = validate(key, form[key]);
    });

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) return;

    try {
      const response = await fetch("http://localhost:5000/api/students/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorAddingStudent"));
      }

      alert(t("studentAddedSuccessfully"));

      setForm({
        childId: "",
        name: "",
        age: "",
        gender: "",
        severity: "",
        communication: "",
        iep: "",
      });

      setErrors({});
    } catch (error) {
      console.error("Error:", error);
      alert(t("errorAddingStudent"));
    }
  };

  return (
    <main className="min-h-screen px-3 py-3 lg:h-dvh lg:overflow-hidden lg:px-5 lg:py-5">
      <section className="mx-auto h-full max-w-7xl">
        <div className="grid h-full gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="sidebar-shell hidden h-full lg:flex lg:flex-col lg:justify-between">
            <div className="space-y-4">
              <div className="rounded-[1.5rem] bg-white/75 p-4 shadow-sm backdrop-blur-sm">
                <p className="badge-soft mb-2">Student Setup</p>
                <h1 className="text-kid-heading text-2xl text-[color:var(--color-text-main)]">
                  {t("addStudent")}
                </h1>
                <p className="mt-2 text-sm leading-5 text-[color:var(--color-text-soft)]">
                  Add a learner profile in a simple, clear dashboard form.
                </p>
              </div>

              <div className="section-card card-sky p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-lg shadow-sm">
                  
                </div>
                <h2 className="text-base font-extrabold text-[color:var(--color-text-main)]">
                  Quick setup
                </h2>
                <p className="mt-2 text-sm leading-5 text-[color:var(--color-text-soft)]">
                  Enter the core details first, then manage progress later.
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
                onClick={() => navigate("/manage-students")}
                className="btn-soft w-full"
              >
                {t("manageStudents")}
              </button>
            </div>
          </aside>

          <section className="flex h-full min-h-0 flex-col rounded-[2rem] bg-white/60 p-3 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-4 lg:p-5">
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
                onClick={() => navigate("/manage-students")}
                className="btn-soft"
              >
                {t("manageStudents")}
              </button>
            </div>

            <div className="page-card flex h-full min-h-0 flex-col p-4 sm:p-5">
              <div className="mb-4 shrink-0 border-b border-brand-100 pb-4">
                <p className="badge-pink mb-2">Student profile</p>
                <h2 className="text-kid-heading text-2xl text-[color:var(--color-text-main)] sm:text-3xl">
                  {t("addStudent")}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-5 text-[color:var(--color-text-soft)]">
                  Fill in the learner details below.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <div className="section-card card-sky p-4">
                      <label htmlFor="childId" className="input-label mb-1.5">
                        {t("childIdPlaceholder")}
                      </label>
                      <input
                        id="childId"
                        name="childId"
                        type="text"
                        placeholder={t("childIdPlaceholder")}
                        value={form.childId}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(errors.childId)}
                        aria-describedby={
                          errors.childId ? "childId-error" : undefined
                        }
                        className={`input-field py-2.5 ${
                          errors.childId
                            ? "border-red-300 focus:border-red-300 focus:ring-red-100"
                            : ""
                        }`}
                      />
                      <p
                        id="childId-error"
                        className={`mt-1 min-h-[1rem] text-xs font-medium ${
                          errors.childId ? "text-red-500" : "text-transparent"
                        }`}
                      >
                        {errors.childId || "."}
                      </p>
                    </div>

                    <div className="section-card card-pink p-4">
                      <label htmlFor="name" className="input-label mb-1.5">
                        {t("namePlaceholder")}
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={t("namePlaceholder")}
                        value={form.name}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={`input-field py-2.5 ${
                          errors.name
                            ? "border-red-300 focus:border-red-300 focus:ring-red-100"
                            : ""
                        }`}
                      />
                      <p
                        id="name-error"
                        className={`mt-1 min-h-[1rem] text-xs font-medium ${
                          errors.name ? "text-red-500" : "text-transparent"
                        }`}
                      >
                        {errors.name || "."}
                      </p>
                    </div>

                    <div className="section-card card-yellow p-4">
                      <label htmlFor="age" className="input-label mb-1.5">
                        {t("agePlaceholder")}
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="text"
                        placeholder={t("agePlaceholder")}
                        value={form.age}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(errors.age)}
                        aria-describedby={errors.age ? "age-error" : undefined}
                        className={`input-field py-2.5 ${
                          errors.age
                            ? "border-red-300 focus:border-red-300 focus:ring-red-100"
                            : ""
                        }`}
                      />
                      <p
                        id="age-error"
                        className={`mt-1 min-h-[1rem] text-xs font-medium ${
                          errors.age ? "text-red-500" : "text-transparent"
                        }`}
                      >
                        {errors.age || "."}
                      </p>
                    </div>

                    <div className="section-card card-mint p-4">
                      <label htmlFor="gender" className="input-label mb-1.5">
                        {t("selectGender")}
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        required
                        className="select-field py-2.5"
                      >
                        <option value="">{t("selectGender")}</option>
                        <option value="Male">{t("male")}</option>
                        <option value="Female">{t("female")}</option>
                      </select>
                      <p className="mt-1 min-h-[1rem] text-xs text-transparent">
                        .
                      </p>
                    </div>

                    <div className="section-card card-purple p-4">
                      <label htmlFor="severity" className="input-label mb-1.5">
                        {t("asdSeverity")}
                      </label>
                      <input
                        id="severity"
                        name="severity"
                        type="text"
                        placeholder={t("asdSeverity")}
                        value={form.severity}
                        onChange={handleChange}
                        className="input-field py-2.5"
                      />
                      <p className="mt-1 min-h-[1rem] text-xs text-transparent">
                        .
                      </p>
                    </div>

                    <div className="section-card card-sky p-4">
                      <label
                        htmlFor="communication"
                        className="input-label mb-1.5"
                      >
                        {t("communicationMode")}
                      </label>
                      <input
                        id="communication"
                        name="communication"
                        type="text"
                        placeholder={t("communicationMode")}
                        value={form.communication}
                        onChange={handleChange}
                        className="input-field py-2.5"
                      />
                      <p className="mt-1 min-h-[1rem] text-xs text-transparent">
                        .
                      </p>
                    </div>

                    <div className="section-card card-pink p-4 md:col-span-2 xl:col-span-3">
                      <label htmlFor="iep" className="input-label mb-1.5">
                        {t("iepReference")}
                      </label>
                      <input
                        id="iep"
                        name="iep"
                        type="text"
                        placeholder={t("iepReference")}
                        value={form.iep}
                        onChange={handleChange}
                        className="input-field py-2.5"
                      />
                      <p className="mt-1 min-h-[1rem] text-xs text-transparent">
                        .
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 shrink-0 border-t border-brand-100 pt-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button type="submit" className="btn-primary">
                      {t("save")}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/manage-students")}
                      className="btn-secondary"
                    >
                      {t("manageStudents")}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="btn-soft"
                    >
                      ← Go to Home
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default AddStudent;