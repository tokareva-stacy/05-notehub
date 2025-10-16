import axios, { type AxiosResponse } from 'axios';
import { type Note, type NewNoteData } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
  console.error(
    'VITE_NOTEHUB_TOKEN is not defined. Please check your .env.local file.'
  );
}

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalNotes: number;
  totalPages: number;
  currentPage: number;
}

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

interface CreateNoteResponse {
  note: Note;
}

interface DeleteNoteResponse {
  noteId: string;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params = {
    page,
    perPage,
    ...(search && { search }), 
  };

  const response: AxiosResponse<FetchNotesResponse> = await instance.get(
    '/notes',
    { params }
  );
  return response.data;
};

export const createNote = async (
  noteData: NewNoteData
): Promise<Note> => {
  const response: AxiosResponse<CreateNoteResponse> = await instance.post(
    '/notes',
    noteData
  );
  return response.data.note;
};

export const deleteNote = async (
  id: string
): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> = await instance.delete(
    `/notes/${id}`
  );
  return response.data;
};