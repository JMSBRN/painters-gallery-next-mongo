import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, SvgIcon } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import styles from './uploadForm.module.scss';
import PublishIcon from '@mui/icons-material/Publish';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setImagesImgBb } from '@/features/images/imagesSlice';
import { ImageFromImgBb } from '@/interfaces/interfacesforImgBb';

const UploadFormImgBB = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fetchMessage, setFetchMessage] = useState<string>('');
  const { id } = useRouter().query;
  const { uploadForm, selectBtn, submitBtn, fetchMessageStyle } = styles;
  const dispatch = useAppDispatch();
  const secret = process.env.CALL_SECRET; 
  const imgBBKey = process.env.IMGBB_KEY;

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
      if(imgBBKey){

      }
      formData.append('image', file);
      formData.append('user_id', `${id}`);
      formData.append('key', imgBBKey!);
      try {
           const res = await fetch('https://api.imgbb.com/1/upload', {
           method: 'POST',
           body: formData,
       });
      const resultImgBb = await res.json();
       if(resultImgBb.status === 200) {
         const res = await fetch('/api/uploads-imgbb/', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ resultImgBb, id })
         });
          const result = await res.json();
          if(result.insertedId) {
            setUploading(false);
            setTimeout(() => {
              setFetchMessage('uploaded');
            }, 500);
            timeOutClearFetchMessage(3000);
          };
       }
      } catch (error) {
        console.error('Error from UploadForm :', error);
      } finally {
        setUploading(false);
        setFile(null);
        const res = await fetch('/api/images-imgbb/', {
          method: 'GET',
          headers: {'Authorization': JSON.stringify({ secret })},
        });
        const images: ImageFromImgBb[] = await res.json();                
       dispatch(setImagesImgBb(images));
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

export default UploadFormImgBB;
