import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, getCollectionData } from '@/lib/mongoUtils';
import { ImageFromImgBb } from '@/interfaces/interfacesforImgBb';
import { ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {    
    if(req.method === 'GET'){
      const images = await getCollectionData('imgBB');
      if (images) {
          res.status(200).json(JSON.parse(images));
      } else {
        res.status(404).json({ message: 'data not found' });
      }
    } else if (req.method === 'POST') {
        if(!req.body) {
            return res.status(204).end();
        } else {
            const { id } = req.body;
            if(id) {
                const images = await getCollectionData('imgBB');
                const parsedImages: ImageFromImgBb[] = JSON.parse(images);
                const filteredImages = parsedImages.filter(el => el.id === id);
                if(images) {
                    res.status(200).json(filteredImages);
                } else {
                    res.status(404).json({ message: 'data not found' });
                } 
            } else {
                res.json([]);
            }
        }
    } else if (req.method === 'DELETE') {
        const auth: { secret: string, id: string } = JSON.parse(req.headers['authorization'] || '');
         const { id } = auth;
         const { db } = await connectToDatabase();  
         const result = await db.collection('imgBB').deleteOne({ _id: new ObjectId(id) });
         res.status(200).json(result);
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