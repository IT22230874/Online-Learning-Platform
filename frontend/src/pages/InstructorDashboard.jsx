import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider";

import Header from "../components/Header";
import DashboardTabs from "../components/DashboardTabs";
import CourseForm from "../components/CourseForm";
import GenericTable from "../components/GenericTable";
import CourseCard from "../components/CourseCard";
import CourseEditor from "../components/CourseEditor";

const API_URL = import.meta.env.VITE_API_URL;

function InstructorDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ title: "", description: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseImage, setCourseImage] = useState("");
  const [courseImageUploading, setCourseImageUploading] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCourses(res.data.courses);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCourseImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCourseImage(res.data.url);
    } catch {
      setMessage("Image upload failed");
    } finally {
      setCourseImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = { ...form, image: courseImage };

    try {
      if (editingCourse) {
        await axios.put(`${API_URL}/api/courses/${editingCourse._id}`, data, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessage("Course updated!");
      } else {
        await axios.post(`${API_URL}/api/courses`, data, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessage("Course created!");
      }
      resetForm();
      fetchCourses();
      setActiveTab("courses");
    } catch (err) {
      setMessage(err.response?.data?.error || "Action failed");
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "" });
    setCourseImage("");
    setEditingCourse(null);
  };

  const [openCourse, setOpenCourse] = useState(null);

  const handleEdit = (course) => setOpenCourse(course);
  const onCourseUpdated = () => {
    setOpenCourse(null);
    fetchCourses();
  };

  const handleViewStudents = async (courseId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/courses/${courseId}/students`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setStudents(res.data.students);
      setShowStudents(true);
    } catch {
      setStudents([]);
    }
  };

  const studentColumns = ["Username", "Email", "Role"];

  const instructorTabs = [
    { key: "courses", label: "My Courses" },
    { key: "add", label: "Add Course" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="p-6 flex-grow">
        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={instructorTabs}
        />

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 mt-4">
            {message}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            {loading ? (
              <p>Loading...</p>
            ) : courses.length === 0 ? (
              <p>No courses found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onEdit={handleEdit}
                    onViewStudents={handleViewStudents}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "add" && (
          <CourseForm
            onSubmit={handleSubmit}
            form={form}
            setForm={setForm}
            editingCourse={editingCourse}
            courseImage={courseImage}
            courseImageUploading={courseImageUploading}
            handleCourseImageChange={handleCourseImageChange}
          />
        )}

        {showStudents && (
          <div className="bg-white p-6 rounded-xl shadow mt-6">
            <h2 className="text-xl font-semibold mb-4">Enrolled Students</h2>
            {students.length === 0 ? (
              <p>No students enrolled.</p>
            ) : (
              <GenericTable columns={studentColumns} data={students} />
            )}
            <button
              onClick={() => setShowStudents(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        )}
      </main>
      {openCourse && (
        <CourseEditor
          course={openCourse}
          onClose={() => setOpenCourse(null)}
          onCourseUpdated={onCourseUpdated}
        />
      )}
    </div>
  );
}

export default InstructorDashboard;
