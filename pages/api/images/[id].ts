import { NextApiRequest, NextApiResponse } from 'next';
import {
  connectToDatabase,
  deleteBucketFile,
  downLoadFilesFromMongoBucket,
} from '@/lib/mongoUtils';
import { ResponseMessages } from '@/constants/constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.url?.split('/')[3];
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const images = await downLoadFilesFromMongoBucket(db, 'images', id);
    if (images) {
      res.status(200).json(images);
    } else {
      res.status(404).json({ message: ResponseMessages.DATA_NOT_FOUND });
    }
  } else if (req.method === 'DELETE') {
    const result = await deleteBucketFile('images', id);
    if (result) {
      res.status(200).json({ message: ResponseMessages.DATA_DELETED });
    } else {
      res.status(404).json({ message: ResponseMessages.DATA_NOT_FOUND });
    }
  } else {
    res.status(405).send('Method not allowed');
  }
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
