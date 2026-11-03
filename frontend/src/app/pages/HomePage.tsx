import { useCreateNote, useNotes } from "@/hooks/useNotes";
import { GlassCard } from "@/components/common/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2Icon, Plus, Search, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useMemo, useState } from "react";

export function HomePage() {
  const { data: notes, isLoading, isError } = useNotes();
  const { mutate: createNote } = useCreateNote();

  const [query, setQuery] = useState<string>("");
  
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    
    const sanitizedQuery = query.toLowerCase().trim();
    if (!sanitizedQuery) return notes;

    return notes.filter((note) =>
      note.title?.toLowerCase().includes(sanitizedQuery)
    );
  }, [notes, query]);

  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  
  const handleNoteClick = (noteId: string): void => {
    navigate(`/notes/${noteId}`);
  };

  const handleCreateNote = (): void => {
    createNote({
      title: formatMessage({ id: "untitledNote" }),
      content: "" 
    },
    {
      onSuccess: (newNote) => {
        navigate(`/notes/${newNote.id}`);
      }
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  return (
    <div className="space-y-12">
      {/* Hero card */}
      <GlassCard className="flex flex-col gap-4 px-4 py-6 sm:px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold tracking-tight">
            <FormattedMessage id="myNotes" />
          </h2>
          <Button variant="default" size="sm" className="cursor-pointer" onClick={handleCreateNote}>
            <Plus className="size-4" />
            <FormattedMessage id="newNote" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            className="pl-10" 
            type="text" 
            value={query}
            placeholder={formatMessage({ id: "searchNotes" })} 
            onChange={handleSearchChange} 
          />
        </div>
      </GlassCard>
      <div>
        {
          isLoading &&
          <p className="flex items-center gap-2">
            <Loader2Icon className="size-4 animate-spin" />
            <FormattedMessage id="loadingNotes" />
          </p>
        }
        {
          isError &&
          <p className="text-red-500 flex items-center gap-2">
            <AlertTriangle className="size-4" />
            <FormattedMessage id="errorLoadingNotes" />
          </p>
        }
        {!isLoading && !isError && filteredNotes.length === 0 && <p><FormattedMessage id="noNotesFound" /></p>}
        {filteredNotes && filteredNotes.length > 0 && (
          <div className="flex flex-col gap-4">
            {filteredNotes.map((note) => (
              <GlassCard key={note.id} className="px-4 py-6 sm:px-6 cursor-pointer" onClick={() => handleNoteClick(note.id)}>
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{note.content}</p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
