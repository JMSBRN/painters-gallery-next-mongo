import React, { useEffect, useState } from 'react';
import { User } from '@/features/users/interfaces';
import UploadForm from '@/components/upload-from/UploadForm';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { selectUsers, setUser } from '@/features/users/usersSlice';
import { ImageFromMongo } from '@/lib/interfacesforMongo';
import Image from 'next/image';
import Loader from '@/components/loader/Loader';
import { useRouter } from 'next/router';

const Painter = () => {
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<ImageFromMongo[]>([]);
  const { id } = useRouter().query;
  const { user } = useAppSelector(selectUsers);

 useEffect(() => {
   const f = async () => {
     const res = await fetch(`/api/users/${id}`);
     const data: User = await res.json();
     dispatch(setUser(data));
   };
   f();
 }, [dispatch, id]);
 
  useEffect(() => {
    const f =async () => {
      const res = await fetch('/api/images');
      const images = await res.json();
      const parsedImages: ImageFromMongo[] = JSON.parse(images || '[]');
     setImages(parsedImages);
    };
    f();
  }, [images]);
  
  const usersPictures = images.filter(el => el.filename.split('/')[1] === id);
  return (
    <div>{user.name}
    {
     !usersPictures.length && <Loader />
    }
       <UploadForm />
       {
        usersPictures.map((el, idx) => 
          <div key={idx.toString()}>
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
    );
  };
  
  export default Painter;
