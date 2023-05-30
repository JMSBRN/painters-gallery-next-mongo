import { addDataToCollection } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method === 'POST') {
        try {
          if(req.body) {
            await addDataToCollection('users', req.body);
            res.status(201).json({ message: 'data sent'});
          } else {
            res.status(204).send({ message: 'data not found'});
          }
          } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
          }
    } else {
      res.status(405).json('Method not allowed');   
    }

};
export default handler;

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};
