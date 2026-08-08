# EI Training System – Repository

This repository contains the codebase and supporting materials for the **EI Training System**, a web application designed to help children learn and recognize emotions through structured activities and assessments. 

The application supports student profile management, pre-/post-test assessments, module-based emotion training activities, and result summaries. This upload is intended to allow reviewers to inspect the data flow, assessment logic, and module implementation used in the research.

---

## Repository Purpose

- Provide the full application code used to generate and manage assessment data.
- Enable viewers to trace how student records, assessments, and module results are stored and processed.
- Support data validation checks for the associated research study.

---

## Project Structure

```text
ei-training-app/
├── frontend/              # React + Vite frontend application
│   ├── src/
│   │   ├── pages/         # Main UI pages (Home, AddStudent, PreTest, Modules, Results)
│   │   ├── components/    # Shared UI components
│   │   └── App.jsx        # Main routing and layout
│   ├── public/
│   │   └── emotion_cards.pdf  # Emotion cards PDF for Module 1
│   └── package.json
│
├── backend/               # Express + MongoDB backend API
│   ├── routes/            # API route handlers (students, assessments, modules)
│   ├── models/            # Mongoose schemas
│   └── server.js          # Main server entry point
│
├── README.md              # This file

```
---

## Technology Stack

- **Frontend:** React 19, Vite, React Router, TailwindCSS
- **Backend:** Node.js, Express, Mongoose (MongoDB Atlas)
- **Database:** MongoDB Atlas
- **PDF Assets:** `emotion_cards.pdf` used for Module 1 activity

---

## Getting Started (Local Setup)

If you need to run the application locally for validation:

### Prerequisites

- Node.js 18+ and npm
- Access to the MongoDB Atlas connection string (provided separately)

### Install & Run

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
# Create .env from .env.example and add MONGODB_URI
node server.js
```

The frontend typically runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

---
Viewers should focus on:

- `backend/routes/assessmentRoutes.js` – how assessments are saved and resumed.
- `backend/routes/moduleRoutes.js` – how module trials and results are recorded.
- `backend/models/` – Mongoose schemas defining data structure for students, assessments, and module results.
- `frontend/src/pages/session/` – how assessment and module data flows through the UI.

All sensitive credentials (e.g., MongoDB URI) have been removed from this repository. Use the provided `.env.example` as a template.
