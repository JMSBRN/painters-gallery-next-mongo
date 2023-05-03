import React from 'react';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
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
  
  export const getServerSideProps: GetServerSideProps<{user: User}> = async (context) => {
  const { id } = context.params!; 
  const user: User = await getUsers(id as string);
   await writeFileAsync(join(cwd(), '/public/users/', `${id as string}.txt`), JSON.stringify(user));
  return {
    props: {
      user
    }
  };
};