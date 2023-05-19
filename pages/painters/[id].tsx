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
import jwt, { JwtPayload } from 'jsonwebtoken';

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
  if (id) {
    const f = async () => {
      const res = await fetch(`/api/users/${id}`);
      const data: User = await res.json();
      dispatch(setUser(data));
    };
    f();
  }
 }, [dispatch, id]);
 
  useEffect(() => {
    setLoading(true);
    const f = async () => {
      const parsedImages  =  await getImagesFromMongo();
      parsedImages && setLoading(false);
     setImages(parsedImages);
    };
    f();
     const token = localStorage.getItem('token') as string;
     jwt.verify(JSON.parse(token), process.env.JWT_ACCES_SECRET!, (err: any, data: any) => {
        if(err) setAuthorized(false); 
        // refresh token 
      if (data) {
        setAuthorized(true);
       }
     });
     
  }, [authorized]);
  
  const handlUpdateImages = async () => {
    setLoading(true);
    const parsedImages  =  await getImagesFromMongo();
    parsedImages && setLoading(false);
    setImages(parsedImages);
  };
  const userImages = images.filter(el => el.filename.split('/')[1] === id);
  return (
    <div className={painterContainer}>
      { authorized ? ( 
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
      ) : <div className="">Token expired. Please login </div> }
    </div>
    );
  };
  
  export default Painter;
  