import { Button, SvgIcon } from '@mui/material';
import React, { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import PublishIcon from '@mui/icons-material/Publish';
import { setImages } from '@/features/images/imagesSlice';
import styles from './uploadForm.module.scss';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { useRouter } from 'next/router';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fetchMessage, setFetchMessage] = useState<string>('');
  const { id } = useRouter().query;
  const { uploadForm, selectBtn, submitBtn, fetchMessageStyle } = styles;
  const dispatch = useAppDispatch();
  const secret = process.env.CALL_SECRET; 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = new FormData();
  const timeOutClearFetchMessage = (timeout: number) => {
    setTimeout(() => {
      setFetchMessage('');
    }, timeout);
  };

    if (file?.type === 'video/mp4') {
      setFile(null);
      setTimeout(() => {
        setFetchMessage('media type not allowed');
      }, 500);
      timeOutClearFetchMessage(3000);
      return;
    }

    if (file) {
      setUploading(true);
      formData.append('image', file);
      formData.append('user_id', `${id}`);
      try {
        const res = await fetch('/api/uploads-mongo/', {
          method: 'POST',
          headers: {'Authorization': JSON.stringify({ secret })},
          body: formData,
        });
        const data = await res.json();
        if (data.message) {
          setTimeout(() => {
            setFetchMessage(data.message);
          }, 500);
          timeOutClearFetchMessage(3000);
        }
      } catch (error) {
        console.error('Error from UploadForm :', error);
      } finally {
        setUploading(false);
        setFile(null);
        const res = await fetch(`/api/images/${id}`, {
          method: 'GET',
          headers: {'Authorization': JSON.stringify({ secret })}
        });
        const data = await res.json();
        dispatch(setImages(JSON.parse(data)));
      }
    } else {
      formData = {} as FormData;
    }
  };

  return (
    <form className={uploadForm} onSubmit={handleSubmit}>
      <div className={fetchMessageStyle}>
        {fetchMessage}
      </div>
      {file ? (
        <LoadingButton
          className={submitBtn}
          type="submit"
          loading={uploading}
          variant="outlined"
          startIcon={
            <SvgIcon>
              <PublishIcon />;
            </SvgIcon>
          }
          loadingPosition="start"
        >
          {file
            ? !uploading
              ? 'Upload file'
              : 'Uploading file'
            : 'No File Chosen'}
        </LoadingButton>
      ) : (
        <Button className={selectBtn} variant="outlined" component="label">
          Select file to Upload
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={handleFileChange}
          />
        </Button>
      )}
    </form>
  );
};

export default UploadForm;
