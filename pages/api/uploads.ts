import { NextApiRequest, NextApiResponse } from 'next';
import { GridFSBucket, MongoClient } from 'mongodb';
import { createReadStream, unlinkSync } from 'fs';
import formidable from 'formidable';
import { join } from 'path';
import { cwd } from 'process';

export const config = {
  api: {
    bodyParser: false,
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
    uploadDir: './public/images',
    keepExtensions: true,
  };
  const form = new formidable.IncomingForm(options);
  form.parse(req, async (err, undefined, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while uploading the image');
      return;
    }
    const filePath = join(cwd(), '/public/images/', `${(files.image as any).newFilename}`);
    const fileStream = createReadStream(filePath);
    const client = new MongoClient(process.env.MONGODB_URI!);
    try {
      await client.connect();

      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('images');
      const result = await collection.insertOne({
        name: (files.image as any).originalFilename,
        newName: (files.image as any).newFilename,
        size: (files.image as any).size,
        mimetype: (files.image as any).mimetype,
      });

      const bucket = new GridFSBucket(db, { bucketName: 'images' });

      const uploadStream = bucket.openUploadStreamWithId(
        result.insertedId,
        (files.image as any).name
      );
      fileStream.pipe(uploadStream);
      unlinkSync(filePath);

      uploadStream.on('error', (error) => {
        console.error(error);
        res.status(500).send('An error occurred while uploading the image');
      });

      uploadStream.on('finish', () => {
        res.status(201).json({ id: result.insertedId });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while uploading the image');
    } finally {
      await client.close();
    }
  });
}
