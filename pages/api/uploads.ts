import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { connectToDatabase, uploadGridFSFile } from '@/lib/mongoUtils';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      handlePost(req, res);
      break;
    default:
      res.status(405).send('Method not allowed');
      break;
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const options = {
    keepExtensions: true,
  };
  const form = new formidable.IncomingForm(options);
  form.parse(req, async (err, undefined, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while uploading the image');
      return;
    }
    const { client, db } = await connectToDatabase();
    const initUploadData = {
      name: (files.image as any).originalFilename,
      newName: (files.image as any).newFilename,
      size: (files.image as any).size,
      mimetype: (files.image as any).mimetype,
    };
    try {
      await client.connect();
      const collection = db.collection('images');
      const result = await collection.insertOne(initUploadData);
      const filePath = (files.image as any).filepath;
     const resultUploader = await uploadGridFSFile(
      filePath,
      db,
      'testo',
      initUploadData.name,
      initUploadData.mimetype
      );
     if(result && resultUploader) {
      res.status(201).json({ message: 'file uploaded'});
     }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while uploading the image');
    } finally {
      await client.close();
    }
  });
}
  
