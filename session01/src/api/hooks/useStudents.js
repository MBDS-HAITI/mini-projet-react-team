import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllStudents, deleteStudent, createStudent, updateStudent } from "../routes/student.api.js";

// Key pour le cache
export const STUDENTS_QUERY_KEY = ["students"];

// Hook pour récupérer tous les étudiants
export const useStudents = () => {
  return useQuery({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: getAllStudents,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook pour créer un étudiant
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      // Invalide le cache des étudiants après une création réussie
      queryClient.invalidateQueries({
        queryKey: STUDENTS_QUERY_KEY,
      });
    },
  });
};

// Hook pour mettre à jour un étudiant
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateStudent(id, data),
    onSuccess: () => {
      // Invalide le cache des étudiants après une mise à jour réussie
      queryClient.invalidateQueries({
        queryKey: STUDENTS_QUERY_KEY,
      });
    },
  });
};

// Hook pour supprimer un étudiant
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      // Invalide le cache des étudiants après une suppression réussie
      queryClient.invalidateQueries({
        queryKey: STUDENTS_QUERY_KEY,
      });
    },
  });
};
