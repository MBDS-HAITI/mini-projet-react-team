import { Routes, Route } from "react-router-dom";
import PublicRoute from "./auth/PublicRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./pages/login/Login";
import HomePage from "./pages/home/Home";
import AboutPage from "./pages/about/About";
import NotFoundPage from "./pages/not-found.jsx/NotFound";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import AcademicYearPage from "./pages/academic-year/AcademicYear";

import SemestresPage from "./pages/semesters/Semesters";
import StudentsPage from "./pages/students/Students";
import ProfilePage from "./pages/profile/Profile";
import EnrollmentsPage from "./pages/enrollments/Enrollments";
import GradesPage from "./pages/grades/Grades";
import CoursesPage from "./pages/courses/Courses";
import UsersPage from "./pages/users/Users";
import { ADMIN_ROLE, SCOLARITE_ROLE, STUDENT_ROLE } from "./utils/roles-type";

export default function Navigation() {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ADMIN_ROLE]} />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={[ADMIN_ROLE, SCOLARITE_ROLE]} />
          }
        >
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/semester" element={<SemestresPage />} />
          <Route path="/academicyears" element={<AcademicYearPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[ADMIN_ROLE, SCOLARITE_ROLE, STUDENT_ROLE]}
            />
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/enrollments" element={<EnrollmentsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
