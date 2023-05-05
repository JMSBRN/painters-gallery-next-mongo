import React, { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { User } from '@/features/users/interfaces';
import UploadForm from '@/components/upload-from/UploadForm';
import { join } from 'path';
import { getCollectionData, writeFileAsync } from '@/lib/mongoUtils';
import { cwd } from 'process';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setUser } from '@/features/users/usersSlice';

const Painter = ({ user }: { user: string}) => {
  const parsedUser: User = JSON.parse(user);
  const dispatch = useAppDispatch();
  useEffect(() => {
   dispatch(setUser(parsedUser));
  }, [dispatch, parsedUser]);
  const handleClick = async () => {
    await fetch('/api/upload-image');
    };
  return (
    <div>{parsedUser.name}
       <UploadForm />
         <button onClick={handleClick}>upload image to mongo</button>
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
   await writeFileAsync(join(cwd(), '/public/users/', `${id as string}.txt`), user);
  return {
    props: {
      user
    }
  };
};