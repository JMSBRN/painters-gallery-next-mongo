import { getfileNamesFromDir } from '@/lib/mongoUtils';
import { unlink } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import { cwd } from 'process';

export const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const files = await getfileNamesFromDir(join(cwd(), '/public/users'));
        const userFileName = files && files[0];
        unlink(join(cwd(), '/public/users/', `${userFileName}`),(err) => {
            if (err) throw  err;
           });
        res.status(201).json('deleted');
        res.end();
    } else {
        res.status(405).json('Method not allowed');
    }
  };

  export const config = {
    api: {
      externalResolver: true,
    },
  };