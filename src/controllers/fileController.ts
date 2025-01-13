import { Request, Response } from 'express';
import s3, { getSignedUrl } from '../utils/awsS3';
import { addFilesToFolder } from '../models/folder';



export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Your upload logic here
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const fileName = `uploads/${Date.now()}_${file.originalname}`
    

    // Example S3 upload logic
    const params = {
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const fileSize = file.size / 1024 / 1024; // in MB
    if (fileSize > 200) { // Limit file size to 200MB
      res.status(400).json({ message: "File size exceeds the limit of 200MB" });
      return;
    }
    
    const uploadResult = await s3.upload(params).promise();
    const folderId = req.body.folderId;
    if (!folderId) {
      res.status(400).json({ message: "No folder ID provided" });
      return;
    }
    const folderPath = uploadResult.Location;

    const fileRecord = await addFilesToFolder(fileName, fileSize, folderId, folderPath);





    res.status(200).json({ message: "File uploaded successfully", fileRecord, uploadDetails: uploadResult });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
    console.log("Downloading file:", req.params[0]);
    try {
        let key = req.params[0];
        key=key.trim();

        if (!key) {
            res.status(400).json({ message: "No file key provided" });
            return 
        }

        const bucketName = process.env.AWS_S3_BUCKET;
        if (!bucketName) {
            res.status(500).json({ message: "S3 bucket name is not configured in environment variables" });
            return 
        }
        const signedUrl = s3.getSignedUrl("getObject", {
            Bucket: process.env.AWS_S3_BUCKET as string, // Bucket name
            Key: key, // File key
            Expires: 60 * 15, // Link valid for 15 minutes
        });

        // Return the signed URL to the client
       res.status(200).json({
            message: "Signed URL generated successfully",
            url: signedUrl,
        });
        return ;


    } catch (error: any) {
        console.error("Error in downloadFile handler:", error);
        res.status(500).json({ message: "Error downloading file", error: error.message });
    }
};