import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) return;

    if (user.role === "instructor") {
      navigate(`/courses/${course._id}`);
    } else if (user.role === "student") {
      navigate(`/student/courses/${course._id}`);
    } else {
      console.warn("Unrecognized user role");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-[1.02] transition duration-300"
    >
      <div className="h-40 w-full bg-gray-200 overflow-hidden">
        <img
          src={
            course.image ||
            "https://res.cloudinary.com/dpbnjoaqi/image/upload/v1749452459/profile_pics/nmvzfkiejoajqmvehscs.png"
          }
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-800 truncate">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {course.description}
        </p>
        {course.category && (
          <span className="text-xs inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full w-fit">
            {course.category}
          </span>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
