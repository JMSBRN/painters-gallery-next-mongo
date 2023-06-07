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
    
};

export default handler;

export const config = {
    api: {
      bodyParser: false,  
      externalResolver: true,
    },
  };