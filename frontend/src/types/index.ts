export type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  summary: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateNoteDTO = {
  title: string;
  content: string;
}

export type TranslateDTO = {
  noteId?: string;
  text?: string;
}