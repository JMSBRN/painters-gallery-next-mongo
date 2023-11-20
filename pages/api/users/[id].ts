import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseMessages } from '@/constants/constants';
import { getCollectionData } from '@/lib/mongoUtils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = req.url?.split('/')[3];    

    if (req.method === 'GET') {
        try {
          const result =  await getCollectionData('users', id) as string;        

          result && res.status(200).json(JSON.parse(result));
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: ResponseMessages.SERVER_ERROR });
        }
    } else {
        res.status(405).send({ message: ResponseMessages.METHOD_NOT_ALLOWED });
    }
};

export default handler;

export const config = {
    api: {
      externalResolver: true,
    },
  };