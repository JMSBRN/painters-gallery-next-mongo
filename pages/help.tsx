import { connectToDatabase, getfileNamesFromDir } from '@/lib/mongoUtils';
import { createReadStream, unlink, unlinkSync } from 'fs';
import { GridFSBucket } from 'mongodb';
import { join } from 'path';
import { cwd } from 'process';
import React from 'react';

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
  const bucket = new GridFSBucket(db, { bucketName: 'testo'});
  const files = await getfileNamesFromDir(join(cwd(), '/public/images'));
  if(files?.length) {
    const filePath = join(cwd(), '/public/images', `${files[0]}`);
    const readStream = createReadStream(filePath).pipe(bucket.openUploadStream('test'));
    readStream.on('close', () => {
      unlink(filePath, (er) => {
        if(er) throw er;
      });
    });
 
  } else {

  }
  return {
    props: data
  };
};