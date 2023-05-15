import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import styles from './uploadForm.module.scss';

  const  UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useRouter().query; 
  const { uploadForm, selectBtn, submitBtn } = styles;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('user_id', `${id}`);
      try {
        const response = await fetch('/api/uploads/', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while uploading the image');
      } finally {
        setUploading(false);
        setFile(null);
      }
    }
  };

  return (
    <form className={uploadForm} onSubmit={handleSubmit}>
      <Button className={selectBtn} variant="contained" component="label">
        Select file
        <input hidden  accept="image/*" multiple type="file" onChange={handleFileChange} />
      </Button>
      {error && <p>{error}</p>}
      <Button
      className={submitBtn}
      type='submit'
      >
        {file ? (!uploading ? 'Upload' : 'Uploading') : 'No File Chosen'}
      </Button >
    </form>
  );
};

export default UploadForm;