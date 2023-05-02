import React from 'react';
import { connectToDatabase, downLoadFilesFromMongoBucket } from '@/lib/mongoUtils';
import Image from 'next/image';
import { ImageFromMongo } from '@/lib/interfacesforMongo';

const about = ({images}: { images: string }) => {
  const arr: ImageFromMongo[] = JSON.parse(images);
  return (
    <>
      {arr.map((image, idx) => (
        <div key={idx}>
          <Image
            src={`${image.data}`}
            width={300}
            height={200}
            alt={image.filename}
            priority={true}
          />
          <div className="">{image.filename}</div>
        </div>
      ))}
    </>
  );
};

export default about;

export const getStaticProps = async () => {
  const { db } = await connectToDatabase();
  const images = await downLoadFilesFromMongoBucket(db, 'testo');
   return {
    props: {
      images,
    }
   };

};