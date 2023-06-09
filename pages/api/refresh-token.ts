import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseMessages } from '@/constants/constants';
import dotenv from 'dotenv';
import { getCollectionData } from '@/lib/mongoUtils';
import jwt from 'jsonwebtoken';

dotenv.config();

const handler =async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const id = req.body;
        if(!id) {
          res.status(204).end();
        } else {
          const data = await getCollectionData('tokens', id) as string;
          if(data) {
            const { token } = JSON.parse(data);
          if (token) {
             jwt.verify(
              token,
              process.env.JWT_REFRESH_SECRET!,
              (err: any, user: any) => {              
              if(err) return  res.status(401);
              if(user) {
                const {id, name } = user;
                  const accessToken = jwt.sign(
                    { id, name },
                    process.env.JWT_ACCES_SECRET!,
                    { expiresIn: '15m' }
                    );
                res.status(201).json({ accessToken });
              }
             });
          }
        } else {
          res.status(204).end();
        }
          }
          
        } catch (error) {
              console.error('error from refresh-token', error);
        }
    } else {
        res.status(405).json({ message: ResponseMessages.METHOD_NOT_ALLOWED });
    }
};

export default handler;