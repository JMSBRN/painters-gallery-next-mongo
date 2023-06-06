import { getCollectionData } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.url?.split('/')[3];    
    if (req.method === 'GET') {
        try {
          const result =  await getCollectionData('users', id);        
          result && res.status(200).json(JSON.parse(result));
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Server error' });
        }
    } else {
        res.status(405).send({ message: 'Method not allowed' });
    }
};

export default handler;

export const config = {
    api: {
      externalResolver: true,
    },
  };