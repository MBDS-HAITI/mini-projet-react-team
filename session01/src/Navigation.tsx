import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Students from "./pages/Students";
import Students2 from "./pages/Students2";
import Grades from "./pages/Grades";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import AddStudent from "./pages/AddStudent";

export default function Navigation() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/add" element={<AddCourse />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students2" element={<Students2 />} />
        <Route path="/students/add" element={<AddStudent />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
