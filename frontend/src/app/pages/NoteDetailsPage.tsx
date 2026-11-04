import { useRewrite, useSummarize, useTranslate } from "@/hooks/useAIFeats";
import { useDeleteNote, useNote, useUpdateNote } from "@/hooks/useNotes";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAutosave, type AutosaveStatus } from "@/hooks/useAutosave";
import { detectTextDirection } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CircleAlertIcon, Languages, Loader2Icon, RotateCcw, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import type { Note, CreateNoteDTO, RewriteMode } from "@/types";
import { FormattedMessage, useIntl } from "react-intl";
import { useLanguage } from "@/hooks/useLanguage";

export function NotesDetailsPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <p><FormattedMessage id="noteNotFound" /></p>;
  }
  return <NoteLoader id={id!} />;
}

function NoteLoader({ id }: { id: string }) {
  const { data: note, isLoading, isError } = useNote(id);

  if (isLoading) return <p><FormattedMessage id="loadingNote" /></p>;
  if (isError) return <p><FormattedMessage id="errorLoadingNote" /></p>;
  if (!note) return <p><FormattedMessage id="noteNotFound" /></p>;

  // `key` resets the editor state if the user navigates to a different note.
  return <NoteEditor key={note.id} note={note} />;
}

function NoteEditor({ note }: { note: Note }) {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const isEmptyContent = content.trim() === "";  // empty content derived state
  const [isAIOperation, setIsAIOperation] = useState(false);

  const { mutateAsync: updateNote } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: translateNote } = useTranslate();
  const { mutate: summarizeNote } = useSummarize();
  const { mutate: rewriteNote } = useRewrite();

  const { isRTL } = useLanguage();

  const save = useCallback(
    (patch: Partial<CreateNoteDTO>) => updateNote({ noteId: note.id, updateNoteDTO: patch }),
    [updateNote, note.id],
  );
  const { queue, flush, discard, hasPending, status } = useAutosave<CreateNoteDTO>(save);

  const handleBack = async () => {
    await flush();
    navigate(-1);
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    queue({ title: e.target.value });
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    queue({ content: e.target.value });
  };

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.focus();
    }
  };

  const handleDeleteNote = () => {
    // Drop pending edits so we don't fire a save for a note that's being deleted.
    discard();
    deleteNote(note.id, {
      onSuccess: () => {
        navigate("/");
        toast.success(formatMessage({ id: "noteDeletedSuccessfully" }));
      },
    });
  };

  // AI features

  const handleTranslate = async () => {
    setIsAIOperation(true);
    await flush();
    if (hasPending()) {
      toast.error(formatMessage({ id: "couldntSaveTranslationCancelled" }));
      return;
    }

    const previousContent = content;

    translateNote(
      { noteId: note.id },
      {
        onSuccess: (translatedText) => {
          setContent(translatedText);
          queue({ content: translatedText });
          toast.success(formatMessage({ id: "noteTranslatedSuccessfully" }), {
            action: {
              label: formatMessage({ id: "undo" }),
              onClick: () => {
                setContent(previousContent);
                queue({ content: previousContent });
              },
            },
          });
        },
        onError: () => toast.error(formatMessage({ id: "failedToTranslateNote" })),
        onSettled: () => setIsAIOperation(false),
      },
    );
  };

  const handleSummarize = async () => {
    setIsAIOperation(true);
    await flush();
    if (hasPending()) {
      toast.error(formatMessage({ id: "couldntSaveSummarizationCancelled" }));
      return;
    }

    const previousContent = content;

    summarizeNote(
      { noteId: note.id },
      {
        onSuccess: (summarizedText) => {
          setContent(summarizedText);
          queue({ content: summarizedText });
          toast.success(formatMessage({ id: "noteSummarizedSuccessfully" }), {
            action: {
              label: formatMessage({ id: "undo" }),
              onClick: () => {
                setContent(previousContent);
                queue({ content: previousContent });
              },
            },
          });
        },
        onError: () => toast.error(formatMessage({ id: "failedToSummarizeNote" })),
        onSettled: () => setIsAIOperation(false),
      },
    );
  };

  const handleRewrite = async (mode: RewriteMode) => {
    setIsAIOperation(true);
    await flush();
    if (hasPending()) {
      setIsAIOperation(false);
      toast.error(formatMessage({ id: "couldntSaveRewriteCancelled" }));
      return;
    }

    const previousContent = content;

    rewriteNote(
      { noteId: note.id, mode },
      {
        onSuccess: (rewrittenText) => {
          setContent(rewrittenText);
          queue({ content: rewrittenText });
          toast.success(formatMessage({ id: "noteToneChangedSuccessfully" }), {
            action: {
              label: formatMessage({ id: "undo" }),
              onClick: () => {
                setContent(previousContent);
                queue({ content: previousContent });
              },
            },
          });
        },
        onError: () => toast.error(formatMessage({ id: "failedToChangeNoteTone" })),
        onSettled: () => setIsAIOperation(false),
      },
    );
  };

  return (
    <GlassCard className="flex flex-col gap-10 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Button variant="outline" className="cursor-pointer" onClick={handleBack}>
              { isRTL ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" /> }
              <span className="hidden sm:inline">
                <FormattedMessage id="backToAllNotes" />
              </span>
            </Button>
            <AutoSaveIndicator status={status} onRetry={() => void flush()} />
          </div>
          <DeleteButton
            handleDelete={handleDeleteNote}
            title={formatMessage({ id: "deleteNote" })}
            description={formatMessage({ id: "deleteNoteConfirmation" })}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="cursor-pointer" disabled={isAIOperation || isEmptyContent} onClick={handleSummarize}>
            <Sparkles />
            <FormattedMessage id="generateSummary" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="cursor-pointer" disabled={isAIOperation || isEmptyContent}>
                <RotateCcw />
                <FormattedMessage id="changeTone" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => void handleRewrite("comedy")}>
                <FormattedMessage id="comedy" />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void handleRewrite("formal")}>
                <FormattedMessage id="formal" />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void handleRewrite("casual")}>
                <FormattedMessage id="casual" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={isAIOperation || isEmptyContent}
            onClick={handleTranslate}
          >
            <Languages />
            <FormattedMessage id="translate" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Input
          value={title}
          dir={detectTextDirection(title, isRTL)}
          className="text-3xl! font-bold border-none shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
          placeholder={formatMessage({ id: "titlePlaceholder" })}
          onKeyDown={handleTitleKeyDown}
          onChange={handleTitleChange}
        />
        <Textarea
          ref={contentRef}
          value={content}
          dir={detectTextDirection(content, isRTL)}
          readOnly={isAIOperation}
          className="field-sizing-content text-xl! border-none shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none resize-none overflow-hidden"
          placeholder={formatMessage({ id: "contentPlaceholder" })}
          onChange={handleContentChange}
        />
      </div>
    </GlassCard>
  );
}

function AutoSaveIndicator({ status, onRetry }: { status: AutosaveStatus; onRetry: () => void }) {
  switch (status) {
    case "saving":
      return (
        <div className="flex items-center gap-2">
          <Loader2Icon className="size-4 text-muted-foreground animate-spin" />
          <span className="text-sm text-muted-foreground"><FormattedMessage id="saving" /></span>
        </div>
      );
    case "dirty":
      return (
        <div className="flex items-center gap-2">
          <CircleAlertIcon className="size-4 text-orange-500" />
          <span className="text-sm text-orange-500"><FormattedMessage id="unsavedChanges" /></span>
        </div>
      );
    case "error":
      return (
        <div className="flex items-center gap-2">
          <CircleAlertIcon className="size-4 text-destructive" />
          <span className="text-sm text-destructive"><FormattedMessage id="couldntSave" /></span>
          <Button variant="link" size="sm" className="h-auto p-0 cursor-pointer" onClick={onRetry}>
            <FormattedMessage id="retry" />
          </Button>
        </div>
      );
    default:
      return <span className="text-sm text-muted-foreground"><FormattedMessage id="allChangesSaved" /></span>;
  }
}