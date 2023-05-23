import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, SvgIcon } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from './uploadForm.module.scss';
import PublishIcon from '@mui/icons-material/Publish';

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
      <Button className={selectBtn} variant="outlined" component="label">
        Select file
        <input hidden  accept="image/*" multiple type="file" onChange={handleFileChange} />
      </Button>
      {error && <p>{error}</p>}
      <LoadingButton
      className={submitBtn}
      type='submit'
      loading={uploading}
      variant="outlined"
      startIcon={ 
        <SvgIcon>
            < PublishIcon />;
        </SvgIcon>
      }
      loadingPosition="start"
      >
        {file ? (!uploading ? 'Upload' : 'Uploading') : 'No File Chosen'}
      </LoadingButton>
    </form>
    
  );
};

export default UploadForm;