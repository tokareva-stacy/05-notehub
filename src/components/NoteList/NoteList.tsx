import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error, variables) => {
      console.error(`Error deleting note ${variables}:`, error);
      alert('Failed to delete note. See console for details.');
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (notes.length === 0) {
    return (
      <p className={css.noNotesMessage}>
        No notes found. Create a new one or adjust your search.
      </p>
    );
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note._id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;