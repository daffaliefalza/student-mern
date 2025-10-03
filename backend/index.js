require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const Student = require("./models/Student");
const rateLimiter = require("./middlewares/rateLimiter");
const app = express();
const PORT = 3000 || 3005;

// connect to database
connectDB();
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// root endpoint
app.get("/", (req, res) => {
  res.send("HELLO FROM THE SERVER");
});

// GET
// POST
// PUT
// DELETE

// GET ALL THE DATA / Students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET Only 1 Data / specific data
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST - Create some data
app.post("/students", async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name || !age) {
      return res.status(400).json({ message: "Name and age are required" });
    }

    const newStudent = new Student({ name, age });

    const saved = await newStudent.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - Update a data
app.put("/students/:id", async (req, res) => {
  try {
    const updates = { name: req.body.name, age: req.body.age };
    const student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Delete the data

app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: `Student ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
