import type { RewriteDTO, SummarizeDTO, TranslateDTO } from "@/types";
import { apiClient } from "./client";

export async function translateNote(translateDTO: TranslateDTO, token: string | null) {
  if (!token) {
    throw new Error("No authentication token available");
  }

  const data = await apiClient<{ result: string }>("/api/ai/translate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(translateDTO),
  });

  return data.result;
}

export async function summarizeNote(summarizeDTO: SummarizeDTO, token: string | null) {
  if (!token) {
    throw new Error("No authentication token available");
  }
  
  const data = await apiClient<{ result: string }>("/api/ai/summarize", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(summarizeDTO),
  });

  return data.result;
}

export async function rewriteNote(rewriteDTO: RewriteDTO, token: string | null) {
  if (!token) {
    throw new Error("No authentication token available");
  }

  const data = await apiClient<{ result: string }>("/api/ai/rewrite", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rewriteDTO),
  });

  return data.result;
}