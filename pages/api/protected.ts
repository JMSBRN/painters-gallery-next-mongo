import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const token = req.headers.authorization?.replace('Bearer', '');
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
          } else {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!);
                return res.status(200).json({ message: 'Accept', user: decoded });
    
            } catch (error) {
              return res.status(401).json({ message: 'Invalid token' });
            }
          }

    } catch (error) {
        console.error(error); 
    }
    
};

export default handler;