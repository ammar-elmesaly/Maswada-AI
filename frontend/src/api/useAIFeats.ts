import type { TranslateDTO } from "@/types";
import { useAuth } from "@clerk/react";
import { useMutation } from "@tanstack/react-query";
import { translateNote } from "./ai";

export function useTranslate() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (translateDTO: TranslateDTO) => {
      const token = await getToken();
      return translateNote(translateDTO, token);
    },
  });
}