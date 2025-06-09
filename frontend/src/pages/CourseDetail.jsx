import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthProvider";
import CourseEditor from "../components/CourseEditor";
import ActionMenu from "../components/ActionMenu";
import { ChevronLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchCourse();
    fetchStudents();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCourse(res.data.course);
    } catch (err) {
      console.error(err);
      navigate("/dashboard");
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/${id}/students`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (!course) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-[#e8f9fb] text-[#23b8d0] hover:bg-[#d3f2f6] px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm mb-6"
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 relative">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-[#253a59]">
                {course.title}
              </h1>
              <ActionMenu
                onEdit={() => setShowEditor(true)}
                onDelete={handleDelete}
              />
            </div>

            <p className="text-gray-700 mb-4">{course.description}</p>

            {course.image && (
              <img
                src={course.image}
                alt="Course"
                className="w-full rounded-lg shadow mb-6"
              />
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#253a59] mb-3">
                Course Content
              </h2>
              {course.sections?.map((section, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-[#23b8d0] mb-1">
                    {section.title}
                  </h3>
                  <ul className="list-disc ml-6 text-gray-800">
                    {section.topics.map((topic, i) => (
                      <li key={i}>
                        <div className="font-medium text-[#253a59]">
                          {topic.title}
                        </div>
                        {topic.content && (
                          <p className="text-sm text-gray-600 mt-1 ml-4">
                            {topic.content}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:w-1/3">
            <h2 className="text-lg font-semibold text-[#253a59] mb-3">
              Enrolled Students
            </h2>
            {students.length > 0 ? (
              <ul className="space-y-3 text-sm text-gray-800">
                {students.map((student) => (
                  <li key={student._id} className="border-b pb-2">
                    <div className="font-medium">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="text-gray-600">{student.email}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No students enrolled.</p>
            )}
          </aside>
        </div>
      </div>

      {showEditor && (
        <CourseEditor
          course={course}
          onClose={() => setShowEditor(false)}
          onCourseUpdated={() => {
            setShowEditor(false);
            fetchCourse();
          }}
        />
      )}
    </div>
  );
}

export default CourseDetail;
