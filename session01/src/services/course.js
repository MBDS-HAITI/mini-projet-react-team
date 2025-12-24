// src/services/course.js
import { API_BASE_URL } from "../config/env.js";

export function postCourse(course) {
  return fetch(`${API_BASE_URL}/courses`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
    }).then(response => response.json())
    .catch(error => {
      console.error('Error adding course:', error);
    });
}

export function getCourses() {
  return fetch(`${API_BASE_URL}/courses`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching courses:', error);
    });
}
