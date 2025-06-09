import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider";
import Header from "../components/Header";
import DashboardTabs from "../components/DashboardTabs";
import CourseCard from "../components/CourseCard";
import SearchBar from "../components/SearchBar";

const API_URL = import.meta.env.VITE_API_URL;

function StudentDashboard() {
  const { logout, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API_URL}/api/student/enrolled`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setEnrolled(res.data.courses))
      .catch(() => setEnrolled([]));
  }, [user]);

  const studentTabs = [
    { key: "available", label: "Available Courses" },
    { key: "enrolled", label: "Enrolled Courses" },
  ];

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEnrolled = enrolled.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="w-full p-8 mt-10 bg-white">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={studentTabs}
        />

        {activeTab === "available" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Available Courses</h3>
            {loading ? (
              <div>Loading...</div>
            ) : filteredCourses.length === 0 ? (
              <div>No courses found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "enrolled" && (
          <>
            <h3 className="text-lg font-semibold mb-2">My Enrolled Courses</h3>
            {filteredEnrolled.length === 0 ? (
              <div>No matching enrolled courses.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEnrolled.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </>
        )}

        {message && (
          <div className="text-center text-sm mt-4 text-green-600">
            {message}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
