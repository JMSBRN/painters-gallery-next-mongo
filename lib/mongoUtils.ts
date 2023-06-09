import { Db, GridFSBucket, MongoClient } from 'mongodb';
import { createReadStream, unlink } from 'fs';
import { readdir, writeFile } from 'fs/promises';
import { ObjectId } from 'mongodb';
import { ResponseMessages } from '@/constants/constants';
import { User } from '@/features/users/interfaces';

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

export const connectToDatabase = async (): Promise<{
  client: MongoClient;
  db: Db;
}> => {
  const client = new MongoClient(uri);
  const db = client.db(dbName);

  return { client, db };
};

export const uploadGridFSFile = async (
  filePath: string,
  bucketName: string,
  userId: string,
  fileName: string,
  contentType: string
) => {
  const { db } = await connectToDatabase();
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

export const downLoadFilesFromMongoBucket = async (
  db: Db,
  bucketName: string,
  fileNameforFind?: string
) => {
  if (fileNameforFind) {
    const files = await db
      .collection(`${bucketName}.files`)
      .find({ filename: fileNameforFind })
      .toArray();
    const images = await Promise.all(
      files.map(async (file) => {
        const data = await db
          .collection(`${bucketName}.chunks`)
          .findOne({ files_id: file._id });

        return {
          ...file,
          data: `data:${file.contentType};base64,${data?.data.toString(
            'base64'
          )}`,
        };
      })
    );
    const filesInString = JSON.stringify(images);

    return filesInString;
  } else {
    const files = await db.collection(`${bucketName}.files`).find().toArray();
    const images = await Promise.all(
      files.map(async (file) => {
        const data = await db
          .collection(`${bucketName}.chunks`)
          .findOne({ files_id: file._id });

        return {
          ...file,
          data: `data:${file.contentType};base64,${data?.data.toString(
            'base64'
          )}`,
        };
      })
    );
    const filesInString = JSON.stringify(images);

    return filesInString;
  }
};

export const deleteBucketFile = async (bucketName: string, fileId?: string) => {
  const { db, client } = await connectToDatabase();
  const file = await db
    .collection(`${bucketName}.files`)
    .findOne({ _id: new ObjectId(fileId) });

  if (file) {
    try {
      const result = await db
        .collection(`${bucketName}.files`)
        .deleteOne({ _id: new ObjectId(fileId) });

      await db
        .collection(`${bucketName}.chunks`)
        .deleteMany({ files_id: new ObjectId(fileId) });
      if (result) return { message: ResponseMessages.DATA_DELETED };
      client.close();
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  } else {
    return null;
  }
};
export const deleteBucketFileByFileNameField= async (
  bucketName: string,
  fileFieldValue?: string
  ) => {
  const { db, client } = await connectToDatabase();
  const file = await db
    .collection(`${bucketName}.files`)
    .findOne({ filename: fileFieldValue });

  if (file) {
    const { _id } = file;

    try {
      const result = await db
        .collection(`${bucketName}.files`)
        .deleteOne({ _id: new ObjectId(_id) });

      await db
        .collection(`${bucketName}.chunks`)
        .deleteMany({ files_id: new ObjectId(_id) });
      if (result) return result;
      client.close();
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  } else {
    return { message: ResponseMessages.DATA_NOT_FOUND };
  }
};

export const getfileNamesFromDir = async (folderPath: string) => {
  const files = await readdir(folderPath);

  if (files.length) {
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

export const getCollectionData = async (
  collectionName: string,
  id?: string,
  name?: string
) => {
  try {
    const { db } = await connectToDatabase();

    if (id) {
      const idItem = await db.collection(collectionName).findOne({ id: id });

      if (idItem) {
        return JSON.stringify(idItem);
      } else {
        return { message: ResponseMessages.DATA_NOT_FOUND };
      }
    } else if (name) {
      const nameItem = await db.collection(collectionName).findOne({ name: name });

      if (nameItem) {
        return JSON.stringify(nameItem);
      } else {
        return JSON.stringify({ message: ResponseMessages.DATA_NOT_FOUND });
      }
    } else {
      const items = await db.collection(collectionName).find().toArray();

      if (items) {
        return JSON.stringify(items);
      } else {
        return JSON.stringify({ message: ResponseMessages.DATA_NOT_FOUND });
      }
    }
  } catch (error) {
    console.error('error from getCollectionData', error);
    return JSON.stringify({ message: ResponseMessages.CONNECTION_FAILED });
  }
};
export const deleteCollectionData = async (
  collectionName: string,
  id?: string
) => {
  const { db } = await connectToDatabase();

  if (id) {
    const itemId = await db.collection(collectionName).deleteOne({ id: id });

    if (itemId) {
      return JSON.stringify(itemId);
    } else {
      return 'data not found ';
    }
  } else {
    const items = await db.collection(collectionName).deleteMany();

    if (items) {
      return JSON.stringify(items);
    } else {
      return 'data not found ';
    }
  }
};

export const addDataToCollection = async (
  nameCollection: string,
  newData: any
) => {
  const { db } = await connectToDatabase();
  const result = await db.collection(nameCollection).insertOne(newData as any);

  if (result) {
    return result;
  } else {
    return null;
  }
};
export const updateDataCollection = async (
  nameCollection: string,
  id: string,
  newData: User
) => {
  const { db } = await connectToDatabase();
  const result = await db
    .collection(nameCollection)
    .updateOne({ _id: new ObjectId(id) }, { $set: newData });

    if (result) {
      return result;
    } else {
      return null;
    }
};
export const deleteDataFromCollection = async (nameCollection: string, id: string) => {
  const { db } = await connectToDatabase();  
  const result = await db.collection(nameCollection).deleteOne({ id });

  if (result) {
    return result;
  } else {
    return null;
  }
};

export const findUserByName = async (name: string) => {
  const users: User[] = JSON.parse(
    (await getCollectionData('users')) as string
  );
  const findedUser = users.find((el) => el.name === name);

  return findedUser;
};
export const findUserByEmail = async (email: string) => {
  const users: User[] = JSON.parse(
    (await getCollectionData('users')) as string
  );
  const findedUser = users.find((el) => el.email === email);

  return findedUser;
};

export const findUser = async (name: string, email: string) => {
  const userByName = await findUserByName(name);
  const userByEmail = await findUserByEmail(email);

  return { userByName, userByEmail };
};
