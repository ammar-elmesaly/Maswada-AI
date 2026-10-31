import { useTranslate } from "@/api/useAIFeats";
import { useDeleteNote, useNote, useUpdateNote } from "@/api/useNotes";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CircleAlertIcon, Languages, Loader2Icon, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function NotesDetailsPage() {
  const DEBOUNCE_DELAY = 1500; // 1.5 seconds debounce delay

  const { id } = useParams<{ id: string }>();

  const { data: note, isLoading, isError } = useNote(id!);
  const { mutate: translateNote, isPending: isTranslatingNote } = useTranslate();
  const { mutate: updateNote, isPending: isUpdatingNote } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();
  
  const [isUnsaved, setIsUnsaved] = useState(false);
  const navigate = useNavigate();
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const pendingUpdates = useRef<{ title?: string; content?: string }>({});

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const adjustTextareaHeight = () => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (note) {
      adjustTextareaHeight();
    }
  }, [note]);

  const scheduleSave = () => {
    setIsUnsaved(true);
    
    if (timeoutRef.current) {  // Clear any existing timeout to reset the timer
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      // Capture the current pending updates and immediately clear the ref.
      // This ensures keystrokes made DURING the network request are not lost.
      const payload = { ...pendingUpdates.current };
      pendingUpdates.current = {}; 
      
      updateNote({
        noteId: id!,
        updateNoteDTO: payload
      }, {
        onSettled: () => {
          // Only clear the unsaved flag if the user hasn't typed anything new 
          // while the mutation was in flight.
          if (Object.keys(pendingUpdates.current).length === 0) {
            setIsUnsaved(false);
          }
        }
      });
      
      timeoutRef.current = null;
    }, DEBOUNCE_DELAY);
  };

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.focus();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    pendingUpdates.current.title = e.target.value;
    scheduleSave();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustTextareaHeight();
    pendingUpdates.current.content = e.target.value;
    scheduleSave();
  };

  const handleDeleteNote = () => {
    deleteNote(id!, {
      onSuccess: () => {
        navigate("/");
        toast.success("Note deleted successfully");
      }
    });
  };

  // AI Features

  const handleTranslate = () => {
    translateNote({ noteId: id! }, {
      onSuccess: (translatedText) => {
        contentRef.current!.value = translatedText;
        pendingUpdates.current.content = translatedText;
        scheduleSave();
        toast.success("Note translated successfully");
      },
      onError: () => {
        toast.error("Failed to translate note");
      }
    });
  }

  if (isLoading) return <p>Loading note...</p>;
  if (isError) return <p>Error loading note.</p>;
  if (!note) return <p>Note not found.</p>;

  return (
    <GlassCard className="flex flex-col gap-10 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Button variant="outline" className="cursor-pointer" onClick={handleBack} >
              <ArrowLeft className="size-4" />
              Back to all notes
            </Button>
            <AutoSaveIndicator isSaving={isUpdatingNote} isUnsaved={isUnsaved} />
          </div>
          <DeleteButton handleDelete={handleDeleteNote} title={"Delete Note"} description={"Are you sure to delete this note? This action cannot be undone."} />
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="cursor-pointer">
            <Sparkles />
            Generate Summary
          </Button>
          <Button variant="outline" className="cursor-pointer">
            <RotateCcw />
            Select Rewrite Mode
          </Button>
          <Button variant="outline" className="cursor-pointer" disabled={isTranslatingNote} onClick={handleTranslate}>
            <Languages />
            Translate
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Input
          defaultValue={note.title}
          className="text-3xl! font-bold border-none shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none" 
          placeholder="Title" 
          onKeyDown={handleTitleKeyDown}
          onChange={handleTitleChange}
        />
        <Textarea 
          ref={contentRef}
          className="text-xl! border-none shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none resize-none overflow-hidden" 
          placeholder="Content" 
          defaultValue={note.content}
          onChange={handleContentChange}
        />
      </div>
    </GlassCard>
  )
}

function AutoSaveIndicator({ isUnsaved, isSaving }: { isUnsaved: boolean; isSaving: boolean }) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-2">
        <Loader2Icon className="size-4 text-muted-foreground animate-spin" />
        <span className="text-sm text-muted-foreground">Saving...</span>
      </div>
    );
  }

  if (isUnsaved) {
    return (
      <div className="flex items-center gap-2">
        <CircleAlertIcon className="size-4 text-orange-500" />
        <span className="text-sm text-orange-500">Unsaved changes</span>
      </div>
    )
  }

  return (
    <span className="text-sm text-muted-foreground">All changes saved</span>
  );
}