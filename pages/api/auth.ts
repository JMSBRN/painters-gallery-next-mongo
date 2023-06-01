import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { addDataToCollection } from '@/lib/mongoUtils';
import { User } from '@/features/users/interfaces';
import secureCookiesUtils from '../../utils/secureCookiesUtils';

dotenv.config();

const { setEncryptedDataToCookie } = secureCookiesUtils;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'POST') {
        if(!req.body) res.status(204).end();
        const user: User = req.body;
        if(user) {
            const resultFromUsers =  await addDataToCollection('users', user);
            if(resultFromUsers) {
                const { id, name } = user;
                const refreshToken = jwt.sign({ id, name }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });
                const result = await addDataToCollection('tokens', { id: user.id, token : refreshToken });
                if(result) {
                    res.status(201).json({ message: 'User created' });
                } else {
                    res.status(400).json({ message: 'error from tokens in mongo' });
                }
            } else {
                res.status(400).json({ message: 'error from users in mongo' });
            }
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