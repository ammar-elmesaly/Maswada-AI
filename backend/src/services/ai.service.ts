import { SummarizeInput, RewriteInput, TranslateInput } from '../validators/ai.schema';
import { notesService } from './notes.service';
import { geminiService } from './gemini.service';

export class AiService {
  async summarize(userId: string, input: SummarizeInput): Promise<{ result: string }> {
    let text = input.text;

    // If noteId provided, fetch note content
    if (input.noteId) {
      const note = await notesService.findByIdAndUserId(input.noteId, userId);
      text = note.content;
    }

    if (!text) {
      throw new Error('No text to summarize');
    }

    const result = await geminiService.summarize(text);
    return { result };
  }

  async rewrite(userId: string, input: RewriteInput): Promise<{ result: string }> {
    let text = input.text;

    // If noteId provided, fetch note content
    if (input.noteId) {
      const note = await notesService.findByIdAndUserId(input.noteId, userId);
      text = note.content;
    }

    if (!text) {
      throw new Error('No text to rewrite');
    }

    const result = await geminiService.rewrite(text, input.mode);
    return { result };
  }

  async translate(userId: string, input: TranslateInput): Promise<{ result: string }> {
    let text = input.text;

    // If noteId provided, fetch note content
    if (input.noteId) {
      const note = await notesService.findByIdAndUserId(input.noteId, userId);
      text = note.content;
    }

    if (!text) {
      throw new Error('No text to translate');
    }

    // Auto-detects language and translates to the opposite (EN↔AR)
    const result = await geminiService.translate(text);
    return { result };
  }
}

export const aiService = new AiService();
