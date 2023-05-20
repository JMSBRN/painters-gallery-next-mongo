import React, { useEffect, useState } from 'react';
import { User } from '@/features/users/interfaces';
import UploadForm from '@/components/upload-from/UploadForm';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectUsers, setUser } from '@/features/users/usersSlice';
import { ImageFromMongo } from '@/lib/interfacesforMongo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './painter.module.scss';
import { LoadingButton } from '@mui/lab';
import { SvgIcon } from '@mui/material';
import DownloadSharpIcon from '@mui/icons-material/DownloadSharp';
import jwt from 'jsonwebtoken';

const Painter = () => {
  const {painterContainer, imagesStyle, uploads, userName, ImageLayout, updateImagesBtn } = styles;
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<ImageFromMongo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const { id } = useRouter().query;
  const { user } = useAppSelector(selectUsers);

  const getImagesFromMongo = async () => {
    const res = await fetch('/api/images/');   
    const images = await res.json();
    const parsedImages: ImageFromMongo[] = JSON.parse(images || '[]');
    return parsedImages;
  };
 
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
    setLoading(true);
    const f = async () => {
      const parsedImages  =  await getImagesFromMongo();
      parsedImages && setLoading(false);
     setImages(parsedImages);
    };
    f();
  
     const token = localStorage.getItem('token') as string;
     jwt.verify(JSON.parse(token), process.env.JWT_ACCES_SECRET!, async (err: any, data: any) => {
       if(err) {
           if (err.message === 'jwt expired') {
             const res = await fetch('/api/refresh-token',{
               method: 'POST',
               headers: { 'Content-type': 'application/json' },
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
  
  const handlUpdateImages = async () => {
    setLoading(true);
    const parsedImages  =  await getImagesFromMongo();
    parsedImages && setLoading(false);
    setImages(parsedImages);
  };
  const userImages = images.filter(el => el.filename.split('/')[1] === id);
  return (
    <div className={painterContainer}>
      { authorized &&
      <><div className={userName}>
          {user.name}
        </div><div className={uploads}>
            <UploadForm />
            <LoadingButton
              className={updateImagesBtn}
              onClick={handlUpdateImages}
              loading={loading}
              startIcon={<SvgIcon>
                <DownloadSharpIcon />;
              </SvgIcon>}
              loadingPosition='start'
              variant='outlined'
            >
              {loading ? 'loading Images' : 'Update Images'}
            </LoadingButton>

          </div><div className={imagesStyle}>
            {userImages.map((el, idx) => <div className={ImageLayout} key={idx.toString()}>
              <Image
                width={20}
                height={20}
                alt={el.filename.split('/')[0]}
                src={el.data} />
            </div>
            )}
          </div></>
       }
    </div>
    );
  };
  
  export default Painter;
  