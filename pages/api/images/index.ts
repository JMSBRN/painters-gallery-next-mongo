import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, downLoadFilesFromMongoBucket } from '@/lib/mongoUtils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {    
    if(req.method === 'GET') {
        const { db } = await connectToDatabase();
        const images = await downLoadFilesFromMongoBucket(db, 'images');
        if(images) {
            res.status(200).json(images);
        } else {
            res.status(404).json({ message: 'data not found' });
        } 
        
    } else {
        res.status(405).json('Method not allowed');   
    }
};

export default handler;

export const config = {
    api: {
      externalResolver: true,
    },
  };