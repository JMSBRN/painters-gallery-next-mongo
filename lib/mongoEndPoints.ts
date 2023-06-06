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
  const id = req.query.userId as string;
  const rgx = /^[0-9a-fA-F]{24}$/.test(id as string);
  const db = client.db(nameDb);
  if (id) {
    if (rgx) {
      switch (method) {
        case 'GET':
          const user = await db
            .collection(nameCollection)
            .findOne({ _id: new ObjectId(id) });
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(404).json({ message: 'data not found' });
          }
          break;
        case 'PUT':
          try {
            const updatedUser = req.body;
            await db
              .collection(nameCollection)
              .updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });
            res.status(200).json({ message: 'data updated' });
          } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
          }
          break;
        case 'DELETE':
          try {
            await db
              .collection(nameCollection)
              .deleteOne({ _id: new ObjectId(id) });
            res.status(200).json({ message: 'data deleted' });
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
          const data = await db.collection(nameCollection).find().toArray();
          res.status(200).json(data);
        } catch (e) {
          console.error(e);
          res.status(500).json({ message: 'Server error' });
        }
        break;
      case 'POST':
        try {
          const newData = req.body;
          await db.collection(nameCollection).insertOne(newData);
          res.status(201).json({ message: 'new data created' });
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
