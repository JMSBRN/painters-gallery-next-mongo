/* eslint-disable import/no-anonymous-default-export */
import clientPromise from '@/lib/mongodb';
import { updateMongoDb } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  updateMongoDb(req, res, client, 'painters', 'users');
};
