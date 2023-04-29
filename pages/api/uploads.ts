import { NextApiRequest, NextApiResponse } from 'next';
import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import { createReadStream, unlinkSync } from 'fs';
import formidable from 'formidable';
import { join } from 'path';
import { cwd } from 'process';

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
    const client = new MongoClient(process.env.MONGODB_URI!);
    const initUploadData = {
      name: (files.image as any).originalFilename,
      newName: (files.image as any).newFilename,
      size: (files.image as any).size,
      mimetype: (files.image as any).mimetype,
    };
    const filePath = join(cwd(), '/public/images/', `${(files.image as any).newFilename}`);
    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('images');
      const result = await collection.insertOne(initUploadData);
      const fileStream = createReadStream(filePath);

      const bucket = new GridFSBucket(db, { bucketName: 'images'});      
      const uploadStream = bucket.openUploadStreamWithId(
        new ObjectId(result.insertedId),
        initUploadData.name
        );
        fileStream.pipe(uploadStream);
        
        uploadStream.on('error', (error) => {
        console.error(error);
        res.status(500).send('An error occurred while uploading the image');        
        process.stdout.write('error');
      });

      uploadStream.on('finish', () => {
        res.status(201).json({ id: result.insertedId });
        process.stdout.write('Image saved to MongoDB \n');
        client.close();
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while uploading the image');
    } finally {
      process.stdout.write('end\n');
      await client.close();
      unlinkSync(filePath);
    }
  });
}
  
