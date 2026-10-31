import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "./notes";
import { useAuth } from "@clerk/react";
import type { CreateNoteDTO } from "@/types";

export const noteKeys = {
  all: ["notes"] as const,
  detail: (id: string) => ["notes", id] as const,
};

export function useNote(noteId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: noteKeys.detail(noteId),
    queryFn: async () => {
      const token = await getToken();
      return getNoteById(noteId, token);
    },
  });
}

export function useNotes() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: noteKeys.all,
    queryFn: async () => {
      const token = await getToken();
      return getAllNotes(token);
    },
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["updateNote"],
    mutationFn: async (createNoteDTO: CreateNoteDTO) => {
      const token = await getToken();
      return createNote(createNoteDTO, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["updateNote"],
    mutationFn: async ({ noteId, updateNoteDTO }: { noteId: string; updateNoteDTO: Partial<CreateNoteDTO> }) => {
      const token = await getToken();
      return updateNote(noteId, updateNoteDTO, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["deleteNote"],
    mutationFn: async (noteId: string) => {
      const token = await getToken();
      return deleteNote(noteId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}