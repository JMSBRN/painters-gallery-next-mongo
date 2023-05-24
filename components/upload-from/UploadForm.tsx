import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Button, SvgIcon } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from './uploadForm.module.scss';
import PublishIcon from '@mui/icons-material/Publish';

  interface UploadFormProps {
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  };

  const  UploadForm = (props: UploadFormProps) => {
  const { setUploaded } = props;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useRouter().query; 
  const fileInputRef = useRef(null);
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
        } else {
          setUploaded(true);
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
      {error && <p>{error}</p>}
      {
        file ?
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
         : 
         <Button className={selectBtn} variant="outlined" component="label">
         Select file
         <input hidden ref={fileInputRef} accept="image/*" multiple type="file" onChange={handleFileChange} />
       </Button>
      }
    </form>
  );
};

export default UploadForm;
