import { connectToDatabase, getfileNamesFromDir, uploadGridFSFile } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import { cwd } from 'process';

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const { db } = await connectToDatabase();
        const files = await getfileNamesFromDir(join(cwd(), '/public/users'));
        const id = files && files[0].split('.')[0];
        await uploadGridFSFile('/public/images',db, 'testo', `${id}`);
        res.status(201).json('ok');
        res.end();
    } else {
        res.status(405).json('Method not allowed');
    }
  };
  
  export default handle;
  
  export const config = {
    api: {
      externalResolver: true,
    },
  };