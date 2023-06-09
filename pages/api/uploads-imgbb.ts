import { addDataToCollection } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req:NextApiRequest, res: NextApiResponse) => {
     if(req.method === 'POST') {
       await handlPost(req, res);
     } else {
        res.status(405).send({ message: 'Method not allowed' });
     }
};

 const handlPost = async (req: NextApiRequest, res: NextApiResponse) => {
   const body = req.body;   
  if(!body) {
    return res.status(204).end();
  } else {
    const { resultImgBb, id } = body;
    console.log(resultImgBb);
    const { display_url, url, title } = resultImgBb.data;
    const newData = { id, display_url, url, title };
    const result = await addDataToCollection('imgBB', newData);
    res.status(201).json(result);
  }
};

export default handler;

export const config = {
    api: {  
      externalResolver: true,
    },
  };