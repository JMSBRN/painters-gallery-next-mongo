import React, { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { User } from '@/features/users/interfaces';
import UploadForm from '@/components/upload-from/UploadForm';
import { getCollectionData } from '@/lib/mongoUtils';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setUser } from '@/features/users/usersSlice';
import { ImageFromMongo } from '@/lib/interfacesforMongo';
import Image from 'next/image';
import Loader from '@/components/loader/Loader';

interface PainterProps { user: string, id: string};

const Painter = ({ user, id }: PainterProps ) => {
  const parsedUser: User = JSON.parse(user);
  const [images, setImages] = useState<ImageFromMongo[]>([]);
  useEffect(() => {
    const f =async () => {
      const res = await fetch('/api/images');
      const images = await res.json();
      const parsedImages: ImageFromMongo[] = JSON.parse(images || '[]');
     setImages(parsedImages);
    };
    f();
  }, [images]);
  
  const dispatch = useAppDispatch();
  useEffect(() => {
   dispatch(setUser(parsedUser));
  }, [dispatch, parsedUser]);
  const usersPictures = images.filter(el => el.filename.split('/')[1] === id);
  return (
    <div>{parsedUser.name}
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

  export const getStaticPaths: GetStaticPaths = async () => {
    const users: string = await getCollectionData('users');
    const parsedUsers: User[] = JSON.parse(users);
    const paths = parsedUsers.map( el => {
      return { 
        params: {
          id: el._id
        }
      };
    });
    return {
      paths, 
      fallback: false
    };
  };
  
  export const getStaticProps: GetStaticProps<{user: string}> = async (context) => {
  const id = context.params?.id as string ; 
  const user: string = await getCollectionData('users', id);

  return {
    props: {
      id,
      user,
    }
  };
};