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

export type SummarizeDTO = {
  noteId?: string;
  texxt?: string;
}

export type RewriteDTO = {
  noteId?: string;
  text?: string;
  mode: RewriteMode;
}

export type RewriteMode = 'comedy' | 'formal' | 'casual';