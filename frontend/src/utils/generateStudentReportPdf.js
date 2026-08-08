import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const safeText = (value) => (value === null || value === undefined || value === "" ? "-" : String(value));

export function generateStudentReportPdf(student, reportData) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 14;
  let y = 18;

  const pre = reportData.preTest;
  const post = reportData.postTest;

  doc.setFontSize(18);
  doc.text("Emotion Recognition Assessment Report", left, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Generated On: ${new Date().toLocaleDateString()}`, left, y);
  y += 8;

  doc.setFontSize(13);
  doc.text("Student Details", left, y);
  y += 7;

  doc.setFontSize(11);
  const studentLines = [
    `Name: ${safeText(student.name)}`,
    `Student ID: ${safeText(student.childId || student._id || reportData.studentId)}`,
    `Age: ${safeText(student.age)}`,
    `Severity: ${safeText(student.severity)}`,
    `Communication: ${safeText(student.communication)}`,
    `IEP: ${safeText(student.iep)}`,
  ];

  studentLines.forEach((line) => {
    doc.text(line, left, y);
    y += 6;
  });

  y += 2;
  doc.setFontSize(13);
  doc.text("Assessment Overview", left, y);
  y += 7;

  doc.setFontSize(11);
  doc.text(`Pre-Test Status: ${safeText(pre.status)}`, left, y);
  y += 6;
  doc.text(`Pre-Test Duration: ${safeText(pre.interventionDuration)}`, left, y);
  y += 6;
  doc.text(`Pre-Test Setting: ${safeText(pre.setting)}`, left, y);
  y += 8;

  doc.text(`Post-Test Status: ${safeText(post.status)}`, left, y);
  y += 6;
  doc.text(`Post-Test Duration: ${safeText(post.interventionDuration)}`, left, y);
  y += 6;
  doc.text(`Post-Test Setting: ${safeText(post.setting)}`, left, y);
  y += 10;

  doc.setFontSize(13);
  doc.text("Pre-Test: Common Pattern Analysis", left, y);
  y += 7;
  doc.setFontSize(11);
  const preLines = doc.splitTextToSize(pre.commonPatternAnalysis || "-", pageWidth - left * 2);
  doc.text(preLines, left, y);
  y += preLines.length * 6 + 4;

  doc.setFontSize(13);
  doc.text("Post-Test: Common Pattern Analysis", left, y);
  y += 7;
  doc.setFontSize(11);
  const postLines = doc.splitTextToSize(post.commonPatternAnalysis || "-", pageWidth - left * 2);
  doc.text(postLines, left, y);
  y += postLines.length * 6 + 8;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Pre-Test", "Post-Test"]],
    body: [
      ["Total Trials", safeText(pre.summary.totalTrials), safeText(post.summary.totalTrials)],
      ["Total Correct", safeText(pre.summary.totalCorrect), safeText(post.summary.totalCorrect)],
      ["Average Score", `${safeText(pre.summary.averageScore)}%`, `${safeText(post.summary.averageScore)}%`],
      ["Total Time", `${safeText(pre.summary.totalTime)}s`, `${safeText(post.summary.totalTime)}s`],
      [
        "Strongest Emotion",
        safeText(pre.summary.strongestEmotions?.join(", ")),
        safeText(post.summary.strongestEmotions?.join(", ")),
      ],
      [
        "Weakest Emotion",
        safeText(pre.summary.weakestEmotions?.join(", ")),
        safeText(post.summary.weakestEmotions?.join(", ")),
      ],
    ],
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 163, 74],
    },
    theme: "grid",
  });

  y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(13);
  doc.text("Recommendation / Summary", left, y);
  y += 7;

  doc.setFontSize(11);
  const recLines = doc.splitTextToSize(reportData.recommendation || "-", pageWidth - left * 2);
  doc.text(recLines, left, y);

  const fileName = `student-report-${safeText(student.childId || student._id || reportData.studentId)}.pdf`;
  doc.save(fileName);
}