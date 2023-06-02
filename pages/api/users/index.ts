import { InitFormData } from '@/features/users/interfaces';
import { getCollectionData, updateDataCollection } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import BcryptedUtils from '../../../utils/bcryptUtils';

const { encryptPassowrd } = BcryptedUtils;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {    
    if (req.method === 'GET') {
        try {
          const result =  await getCollectionData('users');
          const data = JSON.parse(result);
          if (data) {
          res.status(200).json(data);
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }

      } else if (req.method === 'POST') {
        const formData: InitFormData = req.body;
        const { name } = formData;
        if (name) {
          try {
            const result = await getCollectionData('users', undefined, name);    
            const parsedResult = JSON.parse(result);
              res.status(201).json(parsedResult);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Server error' });
        }
      } else {
        res.status(204).end();
      }
    } else if (req.method === 'PUT') {
       if(!req.body) {
        res.status(204).end();
       }  else {
        try {
          const { id, newUser } = req.body;
          const encryptedPassowrd = await encryptPassowrd(newUser.password);
          const newDataToMongo = {...newUser, password: encryptedPassowrd };
          const result = await updateDataCollection('users', id, newDataToMongo );
          res.status(200).json(result);
        } catch (error) {
          console.error(error);
        }
       }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;

export const config = {
    api: {
      externalResolver: true,
    },
  };