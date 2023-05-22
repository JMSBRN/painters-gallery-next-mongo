
import { User } from '@/features/users/interfaces';
import { ObjectId } from 'mongodb';
import { createReadStream, unlink } from 'fs';
import { readdir, writeFile } from 'fs/promises';
import { MongoClient, Db, GridFSBucket } from 'mongodb';

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

export const uploadGridFSFile = async (
  filePath: string,
  db: Db,
  bucketName: string,
  userId: string,
  fileName: string,
  contentType: string
) => {
  const bucket = new GridFSBucket(db, { bucketName: bucketName });
  const uploadStream = bucket.openUploadStream(userId, {
    metadata: {
      fileName,
    },
    contentType: contentType,
  });
  
  const readStream = createReadStream(filePath);
  readStream.pipe(uploadStream);
  
  return new Promise((resolve, reject) => {
    uploadStream.on('finish', resolve);
    uploadStream.on('error', reject);
  });
};

export const downLoadFilesFromMongoBucket = async (db: Db, bucketName: string, fileNameforFind?: string) => {
  if(fileNameforFind) {
    const files = await db.collection(`${bucketName}.files`).find({ filename: fileNameforFind }).toArray(); 
    const images = await Promise.all(
      files.map(async (file) => {
        const data = await db.collection(`${bucketName}.chunks`).findOne({ files_id: file._id });
        return {...file, data: `data:${file.contentType};base64,${data?.data.toString('base64')}`};
      })
      );
      const filesInString = JSON.stringify(images);
    
    return filesInString;
  } else {
    const files = await db.collection(`${bucketName}.files`).find().toArray(); 
    const images = await Promise.all(
      files.map(async (file) => {
        const data = await db.collection(`${bucketName}.chunks`).findOne({ files_id: file._id });
        return {...file, data: `data:${file.contentType};base64,${data?.data.toString('base64')}`};
      })
      );
      const filesInString = JSON.stringify(images);
    
    return filesInString;
  }
};

export const getfileNamesFromDir = async (folderPath: string) => {
    const files = await readdir(folderPath);
     if(files.length) {
         return files;
     } else {
        return;
     }
};
export const writeFileAsync = async (filePath: string, fileContent: string) => {
  try {
    await writeFile(filePath, fileContent);
  } catch (err) {
    throw err;
  }
};

export const clearAllFilesInFolder = async (folderPath: string) => {
  const files = await readdir(folderPath);
  for (const file of files) {
    unlink(`${folderPath}/${file}`, (err) => {
      if (err) throw err;
    });
  }
};

export const getCollectionData = async (collectionName: string, id?: string) => {
  const { db } = await connectToDatabase();
  if(id) {
    const user = (await db
    .collection(collectionName)
    .findOne({ id: id }));
  if (user) {
    return JSON.stringify(user);
  } else {
    return 'data not found ';
  }
  } else {
    const users = await db
    .collection(collectionName)
    .find().toArray();
    if (users) {
      return JSON.stringify(users);
    } else {
      return 'data not found ';
    }
  }
};

export const addDataToCollection = async (nameCollection: string, newData: any) => {
  const { db } = await connectToDatabase();
  await db.collection(nameCollection).insertOne(newData as any);
};
export const updateUser = async (nameCollection: string, id: string, updatedUser: User) => {
  const { db } = await connectToDatabase();
  await db
  .collection(nameCollection)
  .updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });
};
export const deleteUser = async (nameCollection: string, id: string) => {
  const { db } = await connectToDatabase();
  await db
  .collection(nameCollection)
  .deleteOne({ _id: new ObjectId(id) });
};

export const findUserByName = async (name: string) => {
  const users: User[] = JSON.parse(await getCollectionData('users') as string);
  const findedUser = users.find( el => el.name === name);
  return findedUser;
};
export const findUserByEmail = async (email: string) => {
  const users: User[] = JSON.parse(await getCollectionData('users') as string);
  const findedUser = users.find( el => el.email === email);
  return findedUser;
};

export const findUser = async (name: string, email: string) => {
  const userByName = await findUserByName(name);
  const userByEmail = await findUserByEmail(email);
   return {userByName, userByEmail};
};