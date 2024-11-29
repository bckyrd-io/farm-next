import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Disable Next.js's body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }     

  const uploadDir = path.join(process.cwd(), 'public/uploads');

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Handle raw file stream
  const fileName = `${Date.now()}-uploaded-file`;
  const filePath = path.join(uploadDir, fileName);
  const writeStream = fs.createWriteStream(filePath);

  req.on('data', (chunk) => {
    writeStream.write(chunk);
  });

  req.on('end', () => {
    writeStream.end();
    const publicFilePath = `/uploads/${fileName}`;
    return res.status(200).json({ message: 'File uploaded successfully', filePath: publicFilePath });
  });

  req.on('error', (err) => {
    console.error('File upload error:', err);
    writeStream.end();
    return res.status(500).json({ message: 'Failed to upload file' });
  });
};

export default uploadHandler;
