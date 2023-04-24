/* eslint-disable import/no-anonymous-default-export */
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.query;
    const rgx = /^[0-9a-fA-F]{24}$/.test(userId as string);
    if(rgx) {
      const client = await clientPromise;
      const db = client.db('painters');
      const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(userId as string) });
      // regex ?
      
      if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
    } else {
      res.status(404).json({ message: 'Not valid id' });
    }
};