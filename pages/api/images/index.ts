import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { updateMongoDb } from '@/lib/mongoEndPoints';

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  updateMongoDb(req, res, client, 'painters', 'images');
};

export default handle;

export const config = {
  api: {
    externalResolver: true,
  },
};