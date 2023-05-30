import { getCollectionData } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {    
    if (req.method === 'GET') {
        try {
          const result =  await getCollectionData('users');
          const data = JSON.parse(result);
          if (data) {
          res.status(200).json(data);
          }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }

      } else if (req.method === 'POST') {
        const name = req.body;
        if (name) {
          try {
            const result = await getCollectionData('users', undefined, name);    
            const parsedResult = JSON.parse(result);
              res.status(201).json(parsedResult);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Server error' });
        }
      } else {
        res.status(204).send({ message: 'no data' });
      }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;

export const config = {
    api: {
      externalResolver: true,
    },
  };