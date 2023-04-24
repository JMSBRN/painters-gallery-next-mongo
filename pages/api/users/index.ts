import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { updateMongoDb } from '@/utils/apiUtils';

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  updateMongoDb(req, res, client, 'painters', 'users');
};

export default handle;
