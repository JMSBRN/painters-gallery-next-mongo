import React, { useEffect, useState } from 'react';
import { User } from '@/features/users/interfaces';
import UploadForm from '@/components/upload-from/UploadForm';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectUsers, setUser } from '@/features/users/usersSlice';
import { ImageFromMongo } from '@/lib/interfacesforMongo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './painter.module.scss';
import { Button } from '@mui/material';

const Painter = () => {
  const {painterContainer, imagesStyle, uploads, userName, ImageLayout } = styles;
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<ImageFromMongo[]>([]);
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
    const f = async () => {
      const parsedImages  =  await getImagesFromMongo();
     setImages(parsedImages);
    };
    f();
  }, []);
  
  const handlUpdateImages = async () => {
    const parsedImages  =  await getImagesFromMongo();
    setImages(parsedImages);
  };
  const userImages = images.filter(el => el.filename.split('/')[1] === id);
  return (
    <div className={painterContainer}>
      <div className={userName}>
      {user.name}
      </div>
      <div className={uploads}>
       <UploadForm />
        <Button onClick={handlUpdateImages}>update images</Button>

      </div>
       <div className={imagesStyle}>
       {
        userImages.map((el, idx) => 
          <div className={ImageLayout} key={idx.toString()}>
             <Image
              width={20}
              height={20}
              alt={el.filename.split('/')[0]}
              src={el.data}
             />
          </div>
        )
       }
       </div>
    </div>
    );
  };
  
  export default Painter;
  