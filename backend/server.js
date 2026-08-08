const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//ROUTES IMPORT
const studentRoutes = require("./routes/studentRoutes");

//ROUTE MAPPING
app.use("/api/students", studentRoutes);

const assessmentRoutes = require("./routes/assessmentRoutes");
app.use("/api/assessments", assessmentRoutes);

const moduleRoutes = require("./routes/moduleRoutes");
app.use("/api/modules", moduleRoutes);
  
//MongoDB Connection
mongoose.connect("mongodb+srv://bharesearchcon_db_user:RYUMCYC4t32kKmeo@cluster0.i5ickhw.mongodb.net/serve?retryWrites=true&w=majority") 
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));
app.listen(5000, () => {
  console.log("Server running on port 5000");
});