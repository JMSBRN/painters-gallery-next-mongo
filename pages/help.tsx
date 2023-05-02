import React from 'react';
import { connectToDatabase, getfileNamesFromDir } from '@/lib/mongoUtils';
import { createReadStream, unlink, unlinkSync } from 'fs';
import { GridFSBucket } from 'mongodb';
import { join } from 'path';
import { cwd } from 'process';
import mime from 'mime-types';

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
    const contentType  = mime.lookup(files[0]) as string;
    const readStream = createReadStream(filePath).pipe(bucket.openUploadStream('test', {
      contentType: contentType
    }));
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