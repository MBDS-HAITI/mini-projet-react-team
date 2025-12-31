export const validateEnrollment = (values) => {
    const errors = {};

    //Semester
    if (!values.academicYear) {
        errors.academicYear = "L'année académique est requise";
    }
    if (!values.semester) {
        errors.semester = "Le semestre est requis";
    }
    // Course
    if (!values.course) {
        errors.course = "Le cours est requis";
    }
    // Student
    if (!values.student) {
        errors.student = "L'étudiant est requis";
    }
    return errors;
    
}