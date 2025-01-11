import { Request, Response } from 'express';
import s3, { getSignedUrl } from '../utils/awsS3';



export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Your upload logic here
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Example S3 upload logic
    const params = {
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: `uploads/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadResult = await s3.upload(params).promise();

    res.status(200).json({ message: "File uploaded successfully", data: uploadResult });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
    console.log("Downloading file:", req.params.key);
    try {
        const key = req.params[0];
        if (!key) {
            res.status(400).json({ message: "No file key provided" });
            return 
        }

        const bucketName = process.env.AWS_S3_BUCKET;
        if (!bucketName) {
            res.status(500).json({ message: "S3 bucket name is not configured in environment variables" });
            return 
        }

        const params = {
            Bucket: bucketName,
            Key: key,
        };

        // Attempt to get the file from S3
        const fileStream = s3.getObject(params).createReadStream();

        // Handle any errors while reading the file stream
        fileStream.on('error', (error) => {
            console.error("Error reading S3 file stream:", error);
            return res.status(404).json({ message: "File not found or inaccessible", error: error.message });
        });

        // Set headers for the response to indicate a file download
        res.setHeader("Content-Disposition", `attachment; filename="${key}"`);
        res.setHeader("Content-Type", "application/octet-stream");

        // Pipe the S3 file stream directly to the response
        fileStream.pipe(res);
    } catch (error: any) {
        console.error("Error in downloadFile handler:", error);
        res.status(500).json({ message: "Error downloading file", error: error.message });
    }
};