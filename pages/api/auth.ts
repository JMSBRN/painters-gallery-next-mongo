import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { addDataToCollection } from '@/lib/mongoUtils';

dotenv.config();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'POST') {
        if(!req.body) res.status(204);
        const user = req.body;
        const accessToken = jwt.sign(user, process.env.JWT_ACCES_SECRET!, { expiresIn: '1min' });
        const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });
        const result = await addDataToCollection('tokens', { id: user.id, token : refreshToken });
        res.status(201).json({ accessToken, result });

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