import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const client = await clientPromise;
        const db = client.db('painters');
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users);
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
      }
      break;
      
    case 'POST':
      try {
        const client = await clientPromise;
        const db = client.db('painters');

        const newUser = req.body;

        await db.collection('users').insertOne(newUser);

        res.status(201).json({ message: 'User created' });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
      }
      break;

    case 'PUT':
      try {
        const client = await clientPromise;
        const db = client.db('painters');
        const userId = req.query.userId as string;
        const updatedUser = req.body;

        await db
          .collection('users')
          .updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser });

        res.status(200).json({ message: 'User updated' });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
      }
      break;

    case 'DELETE':
      try {
        const client = await clientPromise;
        const db = client.db('painters');

        const userId = req.query.userId as string;

        await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

        res.status(200).json({ message: 'User deleted' });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${method} not allowed` });
  }
};

export default handle;
