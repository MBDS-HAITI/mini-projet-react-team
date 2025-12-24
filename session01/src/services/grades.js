import { API_BASE_URL } from "../config/env.js";

export function postGrade(grade) {
    return fetch(`${API_BASE_URL}/grades`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(grade),
    }).then(response => response.json())
      .catch(error => {
          console.error('Error adding grade:', error);
      });
}

export function getGrades() {
    return fetch(`${API_BASE_URL}/grades`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching grades:', error);
        });
}