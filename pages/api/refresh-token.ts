import { getCollectionData } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const handler =async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const id = req.body;
        if(!id) res.status(204);
        const data = await getCollectionData('tokens', '962a2d60-88a2-4bc5-acf7-52fd481179cd');
           const parsedData = JSON.parse(data);
           const { token } = parsedData;
        if (token) {
           jwt.verify(token, process.env.JWT_REFRESH_SECRET!, (err: any, user: any) => {
            if(err) return  res.status(401);
            if(user) {
                const accessToken = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_ACCES_SECRET!, { expiresIn: '1min' });
              res.status(201).json({ accessToken });
            }
           });
        }
    } else {
        res.status(405).json({ message: 'Method not valid' });
    }
};

export default handler;