import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

function StudentCourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/student/courses/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCourse(res.data.course);
      } catch (err) {
        console.error("Failed to load course", err);
        setMessage("Failed to load course.");
      }
    };

    const fetchEnrollment = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/student/enrolled`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const enrolled = res.data.courses.some((c) => c._id === id);
        setIsEnrolled(enrolled);
      } catch {
        setIsEnrolled(false);
      }
    };

    fetchCourse();
    fetchEnrollment();
  }, [id, user]);

  const handleEnroll = async () => {
    setMessage("");
    try {
      await axios.post(
        `${API_URL}/api/student/courses/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setIsEnrolled(true);
      setMessage("Successfully enrolled!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Enrollment failed.");
    }
  };

  if (!course)
    return <div className="p-6 text-center">Loading course details...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <div className="bg-gray-100 py-10 px-6 sm:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {course.title || "UI/UX Design Course"}
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mb-6">
            {course.description ||
              "This comprehensive program will equip you with the knowledge and skills to create exceptional user interfaces (UI) and enhance user experiences (UX). You'll delve into core principles of UI/UX design, wireframing, prototyping, and usability testing. Below is an overview of the curriculum."}
          </p>
          <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg aspect-video max-w-4xl mx-auto">
            {course.image ? (
              <img
                src={course.image}
                alt="Course Thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500">
                <svg
                  className="w-20 h-20"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10zM9 8H7v2h2V8zm4 0h-2v2h2V8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-2">Course Image</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 sm:p-10 lg:p-12 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {course.sections?.length > 0 ? (
            course.sections.map((section, sectionIndex) => (
              <div
                key={section._id}
                className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <span className="text-4xl font-bold text-gray-300 mr-4">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>
                <div className="space-y-4">
                  {section.topics.map((topic, topicIndex) => (
                    <div
                      key={topic._id}
                      className="border-b border-gray-100 pb-3 last:border-b-0"
                    >
                      <p className="text-base font-medium mb-1">
                        {topic.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 text-center py-10 text-gray-600">
              <p>No course content available yet.</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          {message && (
            <p
              className={`mb-4 text-lg font-medium ${
                isEnrolled ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
          {!isEnrolled ? (
            <button
              onClick={handleEnroll}
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              Enroll Now
            </button>
          ) : (
            <span className="text-green-700 font-bold text-xl p-4 bg-green-100 rounded-full inline-block">
              You are Enrolled!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentCourseDetails;
