import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const token = req.headers.authorization?.replace('Bearer', '');
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
          } else {
            try {
                const decoded = jwt.verify(token, 'secret');
                
                // Perform additional authorization checks if needed
                // For example, check user roles or permissions
            
                // Return protected data or perform specific logic
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