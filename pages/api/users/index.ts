import { NextApiRequest, NextApiResponse } from 'next';
import { 
  deleteBucketFileByFileNameField,
  deleteDataFromCollection,
  getCollectionData,
  updateDataCollection
} from '@/lib/mongoUtils';
import BcryptedUtils from '../../../utils/bcryptUtils';
import { InitFormData } from '@/features/users/interfaces';
import { ResponseMessages } from '@/constants/constants';

const { encryptPassowrd } = BcryptedUtils;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {    
    if (req.method === 'GET') {
        try {
          const result =  await getCollectionData('users') as string;
          const data = JSON.parse(result);
          res.status(200).json(data);
        } catch (error) {
          console.error(error);
          res.status(408).json({ message: ResponseMessages.CONNECTION_FAILED });  
        }

      } else if (req.method === 'POST') {
        const formData: InitFormData = req.body;
        const { name } = formData;
        try {
            if (name) {
            const result = await getCollectionData('users', undefined, name) as string;    
            const parsedResult = JSON.parse(result);
              res.status(201).json(parsedResult);
            } else {
              res.status(204).end();
            }
        } catch (error) {
          console.error('error from getCollectionData', error);
          res.status(408).json({ message: ResponseMessages.CONNECTION_FAILED });
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
          res.status(408).json({ message: ResponseMessages.CONNECTION_FAILED });
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
          res.status(200).json(
            { resultFromDeleteUser,
              resultFromDeleteToken,
              resultFromDeleteImages
            });
        } else {
          res.status(202).json({ message: ResponseMessages.DATA_NOT_DELETED });
         }
         } catch (error) {
          console.error('error from deleteUser functional', error);
          res.status(408).json({ message: ResponseMessages.CONNECTION_FAILED });
         }
       }
    } else {
        res.status(405).json({ message: ResponseMessages.METHOD_NOT_ALLOWED });
    }
};

export default handler;

export const config = {
    api: {
      externalResolver: true,
    },
  };