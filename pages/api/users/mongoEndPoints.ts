import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export const updateMongoDb = async (
  req: NextApiRequest,
  res: NextApiResponse,
  client: MongoClient,
  nameDb: string,
  nameCollection: string
) => {
  const { method } = req;
  const { userId } = req.query;
  const rgx = /^[0-9a-fA-F]{24}$/.test(userId as string);
  const db = client.db(nameDb);
  if (userId) {
    if (rgx) {
      switch (method) {
        case 'GET':
          const id = req.query.userId as string;
          const user = await db
            .collection(nameCollection)
            .findOne({ _id: new ObjectId(id) });
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(404).json({ message: 'User not found' });
          }
          break;
        case 'PUT':
          const userId = req.query.userId as string;
          try {
            const updatedUser = req.body;
            await db
              .collection(nameCollection)
              .updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser });
            res.status(200).json({ message: 'User updated' });
          } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
          }
          break;
        case 'DELETE':
          try {
            const userId = req.query.userId as string;
            await db
              .collection(nameCollection)
              .deleteOne({ _id: new ObjectId(userId) });
            res.status(200).json({ message: 'User deleted' });
          } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
          }
          break;
        default:
          res.status(405).json({ message: 'Method not valid' });
          break;
      }
    } else {
      res.status(400).json({ message: 'Not valid id' });
    }
  } else {
    switch (method) {
      case 'GET':
        try {
          const users = await db.collection('users').find().toArray();
          res.status(200).json(users);
        } catch (e) {
          console.error(e);
          res.status(500).json({ message: 'Server error' });
        }
        break;
      case 'POST':
        try {
          const newUser = req.body;
          await db.collection('users').insertOne(newUser);
          res.status(201).json({ message: 'User created' });
        } catch (e) {
          console.error(e);
          res.status(500).json({ message: 'Server error' });
        }
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${method} not allowed` });
    }
  }
};
