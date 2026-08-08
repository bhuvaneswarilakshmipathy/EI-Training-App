import React from "react";
import Layout from "./Layout";
import { useNavigate, useLocation } from "react-router-dom";

function ResultPage() {

  const location = useLocation();

const moduleName = location.state?.module || "Module";
const results = location.state?.results || [];

  const navigate = useNavigate();

  // TOTAL SCORE
  const totalScore = results.reduce((sum, item) => {
    const emotionScore = item.trials.reduce((s, t) => s + t.correct, 0);
    return sum + emotionScore;
  }, 0);

  // TOTAL TIME
  const totalTime = results.reduce((sum, item) => {
    return sum + item.totalTime;
  }, 0);

  // ANALYSIS
  const strongest = [];
  const weakest = [];

  results.forEach(item => {
    const score = item.trials.reduce((s, t) => s + t.correct, 0);

    if (score >= 2) strongest.push(item.emotion);
    if (score <= 1) weakest.push(item.emotion);
  });
  

  return (
    <Layout>

      <div style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto"
      }}>

        <h1>{moduleName} Results</h1>

        {/* SUMMARY */}
        <h2>Total Score: {totalScore} / 24</h2>
        <h2>Total Time: {totalTime.toFixed(2)} sec</h2>

        <hr />

        {/* ANALYSIS */}
        <h2>Strongest Emotion</h2>
        <p>{strongest.length ? strongest.join(", ") : "None"}</p>

        <h2>Weakest Emotion</h2>
        <p>{weakest.length ? weakest.join(", ") : "None"}</p>

        <h2>Improvement Area</h2>
        <p>{weakest.length ? weakest.join(", ") : "None"}</p>

        <hr />

        {/* TABLE */}
        <h2>Detailed Results</h2>

        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th>Emotion</th>
              <th>Score (Out of 3)</th>
              <th>Time (sec)</th>
              <th>Assistance</th>
            </tr>
          </thead>

          <tbody>
            {results.map((item, index) => {

              const score = item.trials.reduce((s, t) => s + t.correct, 0);

              return (
                <tr key={index}>
                  <td>{item.emotion}</td>
                  <td>{score}</td>
                  <td>{item.totalTime.toFixed(2)}</td>
                  <td>{item.assistance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/*NEXT MODULE BUTTON */}
        <div style={{
          marginTop: "30px",
          textAlign: "center"
        }}>
          <button
            onClick={() => {
  if (moduleName === "Module 1") {
    navigate("/emotion-mirror", {
      state: { module1Results: results }
    });
  } else {
    alert("All modules completed!");
  }
}}
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Go to Module 2 → Emotion Mirror Game
          </button>
        </div>

      </div>

    </Layout>
  );
}

export default ResultPage;