import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:3000/students");
      if (res.status === 429) {
        alert("Too many request please try again later");
        return;
      }
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch single student
  const fetchSingleStudent = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/students/${id}`);
      if (res.status === 429) {
        alert("Too many request, please try again later");
        return;
      }
      if (!res.ok) {
        alert("Student not found");
        return;
      }
      const data = await res.json();
      setSelectedStudent(data);
    } catch (err) {
      console.error("Error fetching single student:", err);
    }
  };

  // Add student
  const addStudent = async (e) => {
    e.preventDefault();
    if (!name || !age) return;

    try {
      const res = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: parseInt(age) }),
      });

      if (res.status === 429) {
        alert("Too many requests. Try later.");
        return;
      }

      const data = await res.json();
      setStudents([...students, data]);
      setName("");
      setAge("");
    } catch (err) {
      console.error(err);
    }
  };

  // Update student
  const updateStudent = async (id, oldName, oldAge) => {
    const newName = prompt("New name:", oldName) || oldName;
    const newAge = prompt("New age:", oldAge) || oldAge;

    try {
      const res = await fetch(`http://localhost:3000/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, age: parseInt(newAge) }),
      });

      if (res.status === 429) {
        alert("Rate limit exceeded!");
        return;
      }

      const data = await res.json();
      setStudents(students.map((s) => (s._id === id ? data : s)));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/students/${id}`, {
        method: "DELETE",
      });

      if (res.status === 429) {
        alert("Rate limit exceeded!");
        return;
      }

      await res.json();
      setStudents(students.filter((s) => s._id !== id));
      if (selectedStudent && selectedStudent._id === id) {
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Student Management</h1>

      {/* Add form */}
      <form onSubmit={addStudent} className="add-form">
        <input
          type="text"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">Add Student</button>
      </form>

      {/* List students */}
      <div className="student-list">
        {students.map((s) => (
          <div key={s._id} className="student-card">
            <p>
              <strong>{s.name}</strong> — Age: {s.age}
            </p>
            <div>
              <button onClick={() => fetchSingleStudent(s._id)}>View</button>
              <button onClick={() => updateStudent(s._id, s.name, s.age)}>
                Edit
              </button>
              <button onClick={() => deleteStudent(s._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Single student view */}
      {selectedStudent && (
        <div className="single-student">
          <h2>Student Details</h2>
          <p>
            <strong>ID:</strong> {selectedStudent._id}
          </p>
          <p>
            <strong>Name:</strong> {selectedStudent.name}
          </p>
          <p>
            <strong>Age:</strong> {selectedStudent.age}
          </p>
          <button onClick={() => setSelectedStudent(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
