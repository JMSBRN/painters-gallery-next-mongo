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
        if(!req.body) res.status(204).send({ message: 'no data' });;
        const user: User = req.body;
        if(user) {
            await addDataToCollection('users', user);
            const { id, name } = user;
            const accessToken = jwt.sign({ id, name }, process.env.JWT_ACCES_SECRET!, { expiresIn: '1min' });
            const refreshToken = jwt.sign({ id, name }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });
            const result = await addDataToCollection('tokens', { id: user.id, token : refreshToken });
            setEncryptedDataToCookie('token', accessToken, req, res);
            res.status(201).json({ accessToken, result });
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