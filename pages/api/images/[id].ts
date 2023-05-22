
import { connectToDatabase, downLoadFilesFromMongoBucket } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.url?.split('/')[3]; 
    if (req.method === 'GET') {
        const { db } = await connectToDatabase();
        const images = await downLoadFilesFromMongoBucket(db, 'testo', id);
        if(images) {
            res.status(200).json(images);
        } else {
            res.status(404).json({ message: 'data not found' });
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