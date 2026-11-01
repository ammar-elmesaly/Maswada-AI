import { useCreateNote, useNotes } from "@/hooks/useNotes";
import { GlassCard } from "@/components/common/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";

export function HomePage() {
  const { data: notes, isLoading, isError } = useNotes();
  const { mutate: createNote } = useCreateNote();

  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  
  const handleNoteClick = (noteId: string): void => {
    navigate(`/notes/${noteId}`);
  };

  const handleCreateNote = (): void => {
    createNote({
      title: "Untitled",
      content: "" 
    },
    {
      onSuccess: (newNote) => {
        navigate(`/notes/${newNote.id}`);
      }
    });
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
          <Input className="pl-10" type="text" placeholder={formatMessage({ id: "searchNotes" })} />
        </div>
      </GlassCard>
      <div>
        {isLoading && <p><FormattedMessage id="loadingNotes" /></p>}
        {isError && <p><FormattedMessage id="errorLoadingNotes" /></p>}
        {notes && notes.length === 0 && <p><FormattedMessage id="noNotesFound" /></p>}
        {notes && notes.length > 0 && (
          <div className="flex flex-col gap-4">
            {notes.map((note) => (
              <GlassCard key={note.id} className="px-4 py-6 sm:px-6 cursor-pointer" onClick={() => handleNoteClick(note.id)}>
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <p className="text-sm text-muted-foreground">{note.content}</p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
