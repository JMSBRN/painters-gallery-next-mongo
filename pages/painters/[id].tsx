import React, { useCallback, useEffect, useState } from 'react';
import { User } from '@/features/users/interfaces';
import UploadForm from '@/components/upload-from/UploadForm';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectUsers, setUser } from '@/features/users/usersSlice';
import { ImageFromMongo } from '@/lib/interfacesforMongo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './painter.module.scss';
import { LoadingButton } from '@mui/lab';
import jwt from 'jsonwebtoken';
import { selectImages, setImages } from '@/features/images/imagesSlice';
import { SvgIcon } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Painter = () => {
  const { painterContainer, imagesStyle, uploads, ImageLayout } = styles;
  const dispatch = useAppDispatch();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const { id } = useRouter().query;
  const { user } = useAppSelector(selectUsers);
  const { images } = useAppSelector(selectImages);
  
  const getImagesFromMongo = useCallback(async () => {
    const res = await fetch(`/api/images/${id}`);   
    const data = await res.json();
    const parsedImages: ImageFromMongo[] = JSON.parse(data || '[]');
    return parsedImages;
  }, [id]);
 
 useEffect(() => {
  if (id && !user.name) {
    const f = async () => {
      const res = await fetch(`/api/users/${id}`);
      const data: User = await res.json();
      dispatch(setUser(data));
    };
    f();
  }
 }, [dispatch, id, user.name]);
 
 useEffect(() => {
  const f = async () => {
    const parsedImages  =  await getImagesFromMongo();
    parsedImages && dispatch(setImages(parsedImages));
  };
  f();
 }, [dispatch, getImagesFromMongo, uploaded]);

  useEffect(() => {   
     const token = localStorage.getItem('token') as string;
     jwt.verify(JSON.parse(token), process.env.JWT_ACCES_SECRET!, async (err: any, data: any) => {
       if(err) {
           if (err.message === 'jwt expired') {
             const res = await fetch('/api/refresh-token',{
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(id)
           });
           const data = await res.json();
           if(data.accessToken) {
             localStorage.setItem('token', JSON.stringify(data.accessToken));
             setAuthorized(true);
           }
        }
      }

      if (data) {
        setAuthorized(true);
       }
     });
     
  }, [id]);
  
  const handleDeleteSelectedImages = async () => {
    setLoading(true);
   const result = await Promise.all(
      selectedImages.map( async (el) => {
        const res = await fetch(`/api/images/${el}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        if (result.message === 'file deleted') {
          // ??? logic
        }
        // logic if error
      })
    );
    if(result) {
      const parsedImages = await getImagesFromMongo();
      dispatch(setImages(parsedImages));
      setLoading(false);
      setSelectedImages([]);
    }
  };

  const handleChangeCheckBox = (e: React.ChangeEvent<HTMLInputElement>)=> {
     const { value, checked } = e.target;
     if(checked) {
       setSelectedImages([...selectedImages, value]);
     } else { 
      setSelectedImages(selectedImages.filter(el => el !== value));
     }
  };

  return (
    <div className={painterContainer}>
      { authorized &&
      <>
        <div className={uploads}>
            {selectedImages.length ?
             <LoadingButton
               loading={loading}
               startIcon={ 
                <SvgIcon>
                    < DeleteForeverIcon />;
                </SvgIcon>
              }
               loadingPosition='start'
               variant='outlined'
               onClick={handleDeleteSelectedImages}
               >
              Delete selected file
             </LoadingButton>
             :
             <UploadForm />
            }
          </div><div className={imagesStyle}>
            {images.map((el, idx) => <div className={ImageLayout} key={idx.toString()}>
                <div className="">
                  <label>
                    <input 
                    type="checkbox"
                    value={el._id.toString()}
                    checked={selectedImages.includes(el._id.toString())}
                    onChange={(e) => handleChangeCheckBox(e)}
                       />
                  </label>
                </div>
              <Image
                width={20}
                height={20}
                alt={el.metadata?.fileName as string}
                src={el.data} />
            </div>
            )}
          </div></>
       }
    </div>
    );
  };
  
  export default Painter;
  