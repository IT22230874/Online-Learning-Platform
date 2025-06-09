import React from "react";
import { AuthProvider, useAuth } from "./AuthProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CompleteSignup from "./pages/CompleteSignup";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import CourseDetail from "./pages/CourseDetail";
import StudentCourseDetails from "./pages/StudentCourseDetails";
import MainLayout from "./layouts/MainLayout";
import { Toaster } from "react-hot-toast";

function OAuthSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      login(token);
      // Remove token from URL
      window.history.replaceState({}, document.title, "/");
      // Wait for login to complete, then reload to trigger AuthProvider
      setTimeout(() => {
        window.location.replace("/");
      }, 200);
    } else {
      // If no token, redirect to login
      navigate("/");
    }
  }, [login, navigate]);
  return (
    <div className="flex justify-center items-center min-h-screen">
      Logging in with Google...
    </div>
  );
}

function AppContent() {
  const { user, login, logout, loading } = useAuth();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      login(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [login]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (user && (user.role === null || user.role === undefined)) {
    return <Navigate to="/complete-signup" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "instructor" ? (
    <Navigate to="/instructor/dashboard" />
  ) : (
    <Navigate to="/student/dashboard" />
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<AppContent />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route
              path="/complete-signup"
              element={<CompleteSignupWrapper />}
            />

            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route
              path="/student/courses/:id"
              element={<StudentCourseDetails />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Wrapper to provide token to CompleteSignup
function CompleteSignupWrapper() {
  const { user } = useAuth();
  const token = user?.token || localStorage.getItem("token");
  return (
    <CompleteSignup token={token} onComplete={() => window.location.reload()} />
  );
}

export default App;
