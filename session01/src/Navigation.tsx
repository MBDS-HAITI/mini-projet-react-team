import { Routes, Route } from "react-router-dom";
import PublicRoute from "./auth/PublicRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./pages/login/Login";
import HomePage from "./pages/home/Home";
import AboutPage from "./pages/about/About";
import NotFoundPage from "./pages/not-found.jsx/NotFound";
import Unauthorized from "./pages/unauthorized/Unauthorized";

export default function Navigation() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          {/* <Route path="/courses" element={<Courses />} />
          <Route path="/courses/add" element={<AddCoursePage />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/add" element={<AddStudentPage />} />
          <Route path="/grades" element={<Grades />} /> */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </>
  );
}
