import type { RewriteDTO, SummarizeDTO, TranslateDTO } from "@/types";
import { useAuth } from "@clerk/react";
import { useMutation } from "@tanstack/react-query";
import { rewriteNote, summarizeNote, translateNote } from "../api/ai";

export function useTranslate() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (translateDTO: TranslateDTO) => {
      const token = await getToken();
      return translateNote(translateDTO, token);
    },
  });
}

export function useSummarize() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (summarizeDTO: SummarizeDTO) => {
      const token = await getToken();
      return summarizeNote(summarizeDTO, token);
    },
  })
}

export function useRewrite() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (rewriteDTO: RewriteDTO) => {
      const token = await getToken();
      return rewriteNote(rewriteDTO, token);
    },
  });
}