import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

function InstructorDashboard() {
  const { logout, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);

  // Fetch instructor's courses
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios
      .get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setCourses(res.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Add or edit course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (editingCourse) {
        // Edit course
        await axios.put(
          `${API_URL}/api/courses/${editingCourse._id}`,
          { title: form.title, description: form.description },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMessage("Course updated!");
      } else {
        // Add new course
        await axios.post(`${API_URL}/api/courses`, form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessage("Course created!");
      }
      setForm({ title: "", description: "" });
      setEditingCourse(null);
      // Refresh courses
      const res = await axios.get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCourses(res.data.courses);
    } catch (err) {
      setMessage(err.response?.data?.error || "Action failed");
    }
  };

  // Start editing a course
  const handleEdit = (course) => {
    setEditingCourse(course);
    setForm({ title: course.title, description: course.description });
  };

  // View enrolled students
  const handleViewStudents = async (courseId) => {
    setShowStudents(true);
    setStudents([]);
    try {
      const res = await axios.get(
        `${API_URL}/api/courses/${courseId}/students`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setStudents(res.data.students);
    } catch {
      setStudents([]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Instructor Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4">
        <h3 className="text-lg font-semibold mb-2">
          {editingCourse ? "Edit Course" : "Add New Course"}
        </h3>
        <input
          name="title"
          placeholder="Course Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          {editingCourse ? "Update Course" : "Add Course"}
        </button>
        {message && (
          <div className="text-center text-sm mt-2 text-green-600">
            {message}
          </div>
        )}
      </form>
      <h3 className="text-lg font-semibold mb-2">Your Courses</h3>
      {loading ? (
        <div>Loading...</div>
      ) : courses.length === 0 ? (
        <div>No courses found.</div>
      ) : (
        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="p-2 border">{course.title}</td>
                <td className="p-2 border">{course.description}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => handleViewStudents(course._id)}
                  >
                    View Students
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showStudents && (
        <div className="mt-8">
          <h4 className="text-md font-semibold mb-2">Enrolled Students</h4>
          {students.length === 0 ? (
            <div>No students enrolled.</div>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Username</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Role</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="p-2 border">{student.username}</td>
                    <td className="p-2 border">{student.email}</td>
                    <td className="p-2 border">{student.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            className="mt-4 bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => setShowStudents(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;
