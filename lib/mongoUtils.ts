import { createReadStream, unlink } from 'fs';
import { readdir } from 'fs/promises';
import { MongoClient, Db, GridFSBucket } from 'mongodb';
import { join } from 'path';
import { cwd } from 'process';
import mime from 'mime-types';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

if (!dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  );
}

export const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);
  return { client, db };
};

export const getfileNamesFromDir = async (path: string) => {
    const files = await readdir(path);
     if(files.length) {
         return files;
     } else {
        return;
     }
};

export const uploadGridFSFile = async (pathToDir: string, db: Db, fileName: string) => {
  const bucket = new GridFSBucket(db, { bucketName: 'testo'});
  const files = await getfileNamesFromDir(join(cwd(), '/public/images'));
  if(files?.length) {
    const filePath = join(cwd(), pathToDir, `${files[0]}`);
    const contentType  = mime.lookup(files[0]) as string;
    const readStream = createReadStream(filePath).pipe(bucket.openUploadStream(fileName, {
      contentType: contentType
    }));
    readStream.on('close', () => {
      unlink(filePath, (er) => {
        if(er) throw er;
      });
    });
 
  }
};