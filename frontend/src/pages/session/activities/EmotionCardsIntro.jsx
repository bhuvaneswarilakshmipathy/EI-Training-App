import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function EmotionCardsIntro() {
  const navigate = useNavigate();
  const { studentId, assessmentId, sessionType } = useParams();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/emotion_cards.pdf";
    link.download = "emotion_cards.pdf";
    link.click();
  };

  const handleContinue = () => {
    console.log("Navigating to module 1:", {
      studentId,
      assessmentId,
      sessionType,
    });

    navigate(`/module1/${studentId}/${assessmentId}/${sessionType}`);
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="page-card">
          <div className="text-center">
            <p className="badge-soft mb-3">Emotion Cards</p>
            <h1 className="text-kid-heading text-3xl text-[color:var(--color-text-main)] sm:text-4xl">
              Download and Prepare the Emotion Cards
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[color:var(--color-text-soft)] sm:text-base">
              Before starting Module 1, please download the emotion cards PDF,
              print it, and cut the cards into separate pluck cards for the student.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[color:var(--color-text-soft)] sm:text-base">
              During the activity, the student should show the matching card in
              front of the camera when prompted.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDownload}
              className="btn-secondary"
            >
              Download PDF
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="btn-primary"
            >
              Continue to Module 1
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EmotionCardsIntro;