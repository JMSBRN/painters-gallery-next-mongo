import clientPromise from '@/lib/mongodb';
import { Collection, InsertOneResult } from 'mongodb';

export const addUser = async (
  name: string,
  email: string,
  password: string
  ): Promise<void> => {
  const client = await clientPromise;
  try {
    await client.connect();
    const database = client.db('painters');
    const users: Collection = database.collection('users');
    const result: InsertOneResult = await users.insertOne({
      name,
      email,
      password,
    });
    console.log(`User with ID ${result.insertedId} has been added`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
};
