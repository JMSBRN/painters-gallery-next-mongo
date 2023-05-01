import { readdir } from 'fs/promises';
import { MongoClient, Db } from 'mongodb';

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
