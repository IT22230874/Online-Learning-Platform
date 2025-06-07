import React from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { AuthProvider, useAuth } from "./AuthProvider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";
import CompleteSignup from "./CompleteSignup";

function AppContent() {
  const { user, login, logout, loading } = useAuth();
  const [showRegister, setShowRegister] = React.useState(false);
  const [pendingToken, setPendingToken] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setPendingToken(token);
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
    return (
      <CompleteSignup
        token={user.token || pendingToken}
        onComplete={(role) => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      {!user ? (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-6 gap-4">
            <button
              className={`px-4 py-2 rounded font-semibold ${
                !showRegister ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setShowRegister(false)}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded font-semibold ${
                showRegister ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
          {showRegister ? (
            <RegisterForm onRegister={() => setShowRegister(false)} />
          ) : (
            <LoginForm onLogin={login} />
          )}
        </div>
      ) : user.role === "instructor" ? (
        <Navigate to="/instructor/dashboard" />
      ) : (
        <Navigate to="/student/dashboard" />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
