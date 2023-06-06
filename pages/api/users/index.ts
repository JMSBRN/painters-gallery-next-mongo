import { InitFormData } from '@/features/users/interfaces';
import { deleteBucketFileByFileNameField, deleteDataFromCollection, getCollectionData, updateDataCollection } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import BcryptedUtils from '../../../utils/bcryptUtils';

const { encryptPassowrd } = BcryptedUtils;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {    
    if (req.method === 'GET') {
        try {
          const result =  await getCollectionData('users');
          const data = JSON.parse(result);
          res.status(200).json(data);
        } catch (error) {
          console.error(error);
          res.status(408).json({ message: 'Connection Failed' });  
        }

      } else if (req.method === 'POST') {
        const formData: InitFormData = req.body;
        const { name } = formData;
        try {
            if (name) {
            const result = await getCollectionData('users', undefined, name);    
            const parsedResult = JSON.parse(result);
              res.status(201).json(parsedResult);
            } else {
              res.status(204).end();
            }
        } catch (error) {
          console.error('error from getCollectionData', error);
          res.status(408).json({ message: 'Connection Failed' });
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
          console.error('error from updateDataCollection', error);
          res.status(408).json({ message: 'Connection Failed' });
        }
       }
    } else if (req.method === 'DELETE') {
      const { id } = JSON.parse(req.headers['authorization'] || '');      
      if(!id){
        res.status(204).end();
       } else { 
         try {
         const resultFromDeleteUser = await  deleteDataFromCollection('users', id);
         const  resultFromDeleteToken =  await deleteDataFromCollection('tokens', id);
         const  resultFromDeleteImages = await deleteBucketFileByFileNameField('images', id);
         if(resultFromDeleteUser && resultFromDeleteToken && resultFromDeleteImages ) {
          res.status(200).json({ resultFromDeleteUser, resultFromDeleteToken, resultFromDeleteImages });
        } else {
          res.status(202).json({ message: 'User was not deleted'});
         }
         } catch (error) {
          console.error('error from deleteUser functional', error);
          res.status(408).json({ message: 'Connection Failed' });
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