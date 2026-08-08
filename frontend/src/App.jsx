import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddStudent from "./pages/AddStudent";
import ManageStudents from "./pages/ManageStudents";
import PreTest from "./pages/session/PreTest";
import MatchingGame from "./pages/session/activities/MatchingGame";
import EmotionMirrorGame from "./pages/session/activities/EmotionMirrorGame";
import SocialStory from "./pages/session/activities/SocialStory";
import ModuleResultPage from "./pages/session/results/ModuleResultPage";
import PreTestResultPage from "./pages/session/results/PreTestResultPage";
import EmotionCardsIntro from "./pages/session/activities/EmotionCardsIntro";
import "./i18n";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/manage-students" element={<ManageStudents />} />
        <Route path="/pretest/:studentId" element={<PreTest />} />

        <Route path="/module1/:studentId" element={<MatchingGame />} />
        <Route path="/module2/:studentId" element={<EmotionMirrorGame />} />
        <Route path="/module3/:studentId" element={<SocialStory />} />

        <Route
          path="/module1/:studentId/:assessmentId/:sessionType"
          element={<MatchingGame />}
        />
        <Route
          path="/module2/:studentId/:assessmentId/:sessionType"
          element={<EmotionMirrorGame />}
        />
        <Route
          path="/module3/:studentId/:assessmentId/:sessionType"
          element={<SocialStory />}
        />

        <Route
          path="/module1-result/:studentId/:assessmentId/:sessionType"
          element={<ModuleResultPage />}
        />
        <Route
          path="/module2-result/:studentId/:assessmentId/:sessionType"
          element={<ModuleResultPage />}
        />
        <Route
          path="/module3-result/:studentId/:assessmentId/:sessionType"
          element={<ModuleResultPage />}
        />
        <Route
          path="/pretest-result/:studentId/:assessmentId/:sessionType"
          element={<PreTestResultPage />}
        />
        <Route
  path="/emotion-cards-intro/:studentId/:assessmentId/:sessionType"
  element={<EmotionCardsIntro />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;