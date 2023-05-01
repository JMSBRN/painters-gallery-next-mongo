import React from 'react';
import { connectToDatabase } from '@/lib/mongoUtils';
import Image from 'next/image';

interface Image {
  id: string;
  filename: string;
  contentType: string;
  data: Buffer;
}
const about = ({images}: { images: Image[] }) => {
  return (
    <>
      {images.map((image) => (
        <>
          <Image
            key={image.id}
            src={`data:${image.contentType};base64,${image.data?.toString('base64')}`}
            width={300}
            height={200}
            alt={image.filename}
          />
        </>
      ))}
    </>
  );
};

export default about;

export const getStaticProps = async () => {
  const { db } = await connectToDatabase();
  const files = await db.collection('testo.files').find({ filename: 'test' }).toArray();  
  const images = await Promise.all(
    files.map(async (file) => {
      const data = await db.collection('testo.chunks').findOne({ files_id: file._id });
      return `data:${file.contentType};base64,${data?.data.toString('base64')}`;
    })
  );
  return {
    props: {
      images
    }
  };
};