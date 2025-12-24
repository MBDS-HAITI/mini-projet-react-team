import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import HomePage from "./pages/home/Home";
import LoginPage from "./pages/Login";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Grades from "./pages/Grades";
import Students from "./pages/Students";
import AddCoursePage from "./pages/AddCourse";
import AddStudentPage from "./pages/AddStudent";
import NotFound from "./pages/NotFound";

export default function Navigation() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/add" element={<AddCoursePage />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/add" element={<AddStudentPage />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
