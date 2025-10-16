import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type NoteTag, type NewNoteData } from '../../types/note';
import { createNote } from '../../services/noteService';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Maximum 500 characters'),
  tag: Yup.string()
    .oneOf<NoteTag>(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Invalid tag selected'
    )
    .required('Tag is required'),
});

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose(); 
    },
    onError: (error) => {
      console.error('Error creating note:', error);
      alert('Failed to create note. See console for details.');
    },
  });

  const formik = useFormik<NewNoteData>({
    initialValues: {
      title: '',
      content: '',
      tag: 'Personal',
    },
    validationSchema: NoteSchema,
    onSubmit: (values) => {
      createMutation.mutate(values);
    },
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
  } = formik;

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h2>Create New Note</h2>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.title && errors.title && (
          <span className={css.error}>{errors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={values.content}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.content && errors.content && (
          <span className={css.error}>{errors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={values.tag}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {touched.tag && errors.tag && (
          <span className={css.error}>{errors.tag}</span>
        )}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting || !formik.isValid}
        >
          {isSubmitting ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;