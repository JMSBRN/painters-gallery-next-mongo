import React from 'react';
import { connectToDatabase, uploadGridFSFile } from '@/lib/mongoUtils';

const Help = ({ data }: { data: {}} ) => {  
  return (
    <div>
      help
    </div>

  );
};

export default Help;
export const getStaticProps = async() => {
  const data = {};
  const { db } = await connectToDatabase();
  await uploadGridFSFile('/public/images', db, 'user_f');   
  return {
    props: data
  };
};