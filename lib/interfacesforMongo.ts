import { ObjectId } from 'mongodb';

export interface ImageFromMongo {
    data: string;
    _id: ObjectId;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    contentType: string;
    metadata?: {
      fileName: string,
    }
  }