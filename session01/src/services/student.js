import { API_BASE_URL } from "../BaseUrls/baseUrls";

export function postStudent(student) {
  return fetch(`${API_BASE_URL}/students`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
    }).then(response => response.json())
    .catch(error => {
      console.error('Error adding student:', error);
    });
}

export function getStudents() {
  return fetch(`${API_BASE_URL}/students`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching students:', error);
    }); 
}
