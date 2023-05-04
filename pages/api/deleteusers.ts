import { clearAllFilesInFolder } from '@/lib/mongoUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import { cwd } from 'process';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
       await clearAllFilesInFolder(join(cwd(), '/public/users/'));
        res.status(201).json('deleted');
        res.end();
    } else {
      res.status(405).json('Method not allowed');
    }
  };
export default handler;

  export const config = {
    api: {
      externalResolver: true,
    },
  };