import { addDataToCollection } from '@/lib/mongoUtils';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req:NextApiRequest, res: NextApiResponse) => {
     if(req.method === 'POST') {
       await handlPost(req, res);
     } else {
        res.status(405).send({ message: 'Method not allowed' });
     }
};

 const handlPost = async (req: NextApiRequest, res: NextApiResponse) => {
    if(!req.body) {
      res.status(204).end();
    }
     const { data, formData } = req.body;
     const { display_url, delete_url } = data;
     const { user_id } = formData;
     const result = await addDataToCollection('imgBB', { display_url, delete_url, user_id });
     if(result) {
       res.status(200).json(result);
      } else {
        res.status(401).json( { message: 'data not created' });
     }
};

export default handler;

export const config = {
    api: {
      bodyParser: false,  
      externalResolver: true,
    },
  };