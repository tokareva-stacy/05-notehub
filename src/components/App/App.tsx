import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from 'use-debounce';
import "modern-normalize";

import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";

import { fetchNotes, type FetchNotesResponse } from "../../services/noteService";

import css from "./App.module.css";

const NOTES_PER_PAGE = 12;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse>({ 
    queryKey: ['notes', currentPage, debouncedSearchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: NOTES_PER_PAGE,
        search: debouncedSearchQuery,
      }),
    placeholderData: (previousData) => previousData,
});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); 
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading) {
    return <div className={css.app}>Loading notes...</div>;
  }

  if (isError) {
    return (
      <div className={css.app}>
        <div className={css.errorBlock}>
          Error loading notes: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  const { notes, totalPages } = data!;
  
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      <NoteList notes={notes} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NoteForm onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default App;