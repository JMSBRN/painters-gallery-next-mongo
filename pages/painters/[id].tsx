import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { User } from '@/features/users/interfaces';
import { getUsers } from '@/utils/apiUtils';
import UploadForm from '@/components/upload-from/UploadForm';
import { join } from 'path';
import { writeFileAsync } from '@/lib/mongoUtils';
import { cwd } from 'process';

interface PainterPeops {
  user: User;
}
const Painter = (props: PainterPeops) => {
  const { user } = props;
  const handleClick = async () => {
     const res = await fetch('/api/upload-image');
     const data = await res.json();
  };
  return (
    <div>{user.name}
       <UploadForm />
         <button onClick={handleClick}>upload image to mongo</button>
    </div>
    );
  };
  
  export default Painter;

  export const getStaticPaths: GetStaticPaths = async () => {
    const users: User[] = await getUsers();
    const paths = users.map((el) => ({ params: { id: el._id} }));      
    return {
      paths,
      fallback: false,
    };
  };
  
  export const getStaticProps: GetStaticProps<{user: User}> = async (context) => {
  const { id }= context.params!; 
  const res = await fetch(`http://localhost:3000/api/users/${id}`);
   const user = await res.json();
   await writeFileAsync(join(cwd(), '/public/users/', `${user._id}.txt`), JSON.stringify(user));
  return {
    props: {
      user
    }
  };
};