import type { CreateNoteDTO, Note } from "@/types";
import { apiClient } from "./client";

export async function getNoteById(noteId: string, token: string | null) {
  if (!token) {
    throw new Error("No authentication token available");
  }
  
  const data = await apiClient<{ note: Note }>(`/api/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.note;
}

export async function getAllNotes(token: string | null) {
  if (!token) {
    throw new Error("No authentication token available");
  }

  const data = await apiClient<{ notes: Note[] }>("/api/notes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.notes;
}

export async function createNote(createNoteDTO: CreateNoteDTO, token: string | null) {
  if (!token) {
    throw new Error("No authentication token available");
  }
  

  const data = await apiClient<{ note: Note }>("/api/notes", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createNoteDTO),
  })

  return data.note;
}

export async function updateNote(noteId: string, updateNoteDTO: Partial<CreateNoteDTO>, token: string | null) {
  if (!token) {
    throw new Error("No authentication token available");
  }

  const data = await apiClient<{ note: Note }>(`/api/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateNoteDTO),
  });
  
  return data.note;
}

export async function deleteNote(noteId: string, token: string | null) {
  if (!token) {
    throw new Error("No authentication token available");
  }

  await apiClient(`/api/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}