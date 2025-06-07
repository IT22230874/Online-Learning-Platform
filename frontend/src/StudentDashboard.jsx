import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

function StudentDashboard() {
  const { logout, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch all available courses
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios
      .get(`${API_URL}/api/student/courses`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setCourses(res.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Fetch enrolled courses
  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API_URL}/api/student/enrolled`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setEnrolled(res.data.courses))
      .catch(() => setEnrolled([]));
  }, [user, message]);

  // View course details
  const handleViewDetails = async (courseId) => {
    setSelectedCourse(null);
    setMessage("");
    try {
      const res = await axios.get(
        `${API_URL}/api/student/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setSelectedCourse(res.data.course);
    } catch {
      setMessage("Failed to fetch course details");
    }
  };

  // Enroll in a course
  const handleEnroll = async (courseId) => {
    setMessage("");
    try {
      await axios.post(
        `${API_URL}/api/student/courses/${courseId}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMessage("Enrolled successfully!");
      // Refresh enrolled courses
      const res = await axios.get(`${API_URL}/api/student/enrolled`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEnrolled(res.data.courses);
    } catch (err) {
      setMessage(err.response?.data?.error || "Enrollment failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2">Available Courses</h3>
      {loading ? (
        <div>Loading...</div>
      ) : courses.length === 0 ? (
        <div>No courses available.</div>
      ) : (
        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Instructor</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="p-2 border">{course.title}</td>
                <td className="p-2 border">
                  {course.instructor?.username || "-"}
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => handleViewDetails(course._id)}
                  >
                    Details
                  </button>
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => handleEnroll(course._id)}
                    disabled={enrolled.some((c) => c._id === course._id)}
                  >
                    {enrolled.some((c) => c._id === course._id)
                      ? "Enrolled"
                      : "Enroll"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedCourse && (
        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h4 className="text-md font-semibold mb-2">Course Details</h4>
          <div>
            <strong>Title:</strong> {selectedCourse.title}
          </div>
          <div>
            <strong>Description:</strong> {selectedCourse.description}
          </div>
          <div>
            <strong>Instructor:</strong>{" "}
            {selectedCourse.instructor?.username || "-"}
          </div>
          <button
            className="mt-4 bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => setSelectedCourse(null)}
          >
            Close
          </button>
        </div>
      )}
      <h3 className="text-lg font-semibold mt-8 mb-2">My Enrolled Courses</h3>
      {enrolled.length === 0 ? (
        <div>You are not enrolled in any courses.</div>
      ) : (
        <ul className="list-disc pl-6">
          {enrolled.map((course) => (
            <li key={course._id} className="mb-1">
              {course.title} (Instructor: {course.instructor?.username || "-"})
            </li>
          ))}
        </ul>
      )}
      {message && (
        <div className="text-center text-sm mt-4 text-green-600">{message}</div>
      )}
    </div>
  );
}

export default StudentDashboard;
