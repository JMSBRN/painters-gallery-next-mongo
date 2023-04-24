import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { updateMongoDb } from '@/pages/api/users/mongoEndPoints';

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  updateMongoDb(req, res, client, 'painters', 'users');
};

export default handle;

export const config = {
  api: {
    externalResolver: true,
  },
};