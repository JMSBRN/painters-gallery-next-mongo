import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { connectToDatabase, uploadGridFSFile } from '@/lib/mongoUtils';

const handler = async (req: NextApiRequest, res: NextApiResponse) =>  {
  switch (req.method) {
    case 'POST':
      handlePost(req, res);
      break;
    default:
      res.status(405).send('Method not allowed');
      break;
  }
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
    
    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('error from form.parse', err);
        return;
      }
      const idUser = fields.user_id as string;
      const { client, db } = await connectToDatabase();
      const initUploadData = {
        name: (files.image as any).originalFilename,
        newName: (files.image as any).newFilename,
        size: (files.image as any).size,
        mimetype: (files.image as any).mimetype,
      };
      try {
        await client.connect();
        const filePath = (files.image as any).filepath;
        const bucketFileName = initUploadData.name;
        const resultUploader = await uploadGridFSFile(
        filePath,
        'images',
        idUser,
        bucketFileName,
        initUploadData.mimetype
        );
       if(resultUploader) {
        res.status(201).json({ message: 'file uploaded'});
       }
      } catch (error) {
        console.error('error from mongo ', error);
      } finally {
        await client.close();
      }
    });
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
