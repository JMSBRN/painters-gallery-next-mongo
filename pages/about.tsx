import React from 'react';
import { connectToDatabase } from '@/lib/mongoUtils';
import Image from 'next/image';

const about = ({imagesSrc}: { imagesSrc: string[] }) => {
  return (
    <>
      {imagesSrc.map((image, idx) => (
        <div key={idx}>
          <Image
            src={`${image}`}
            width={300}
            height={200}
            alt={'test'}
            priority={true}
          />
        </div>
      ))}
    </>
  );
};

export default about;

export const getStaticProps = async () => {
  const { db } = await connectToDatabase();
  const files = await db.collection('testo.files').find({ filename: 'test' }).toArray(); 
  const imagesSrc = await Promise.all(
    files.map(async (file) => {
      const data = await db.collection('testo.chunks').findOne({ files_id: file._id });
      return `data:${file.contentType};base64,${data?.data.toString('base64')}`;
    })
  );
  
  return {
    props: {
      imagesSrc
    }
  };
};