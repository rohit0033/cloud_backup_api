import { Request, Response } from 'express';
import { createfolder, deleteFolder, delteFilesInFolder, getFilesInFolder, getUserFolder } from '../models/folder';
import s3 from '../utils/awsS3';


export const createFolderFun= async(req: Request, res: Response) => {
    const {userid, foldername} = req.body;
    if (foldername === undefined || userid === undefined) {
        res.status(400).json({ message: "Please provide foldername and userid" });
        return;
    }
    try {
        const folder= await createfolder(foldername, userid);
        res.status(200).json({ message: "Folder created successfully", data: folder });
        
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ message: "Error creating folder", error: error.message });
        
    }
}

export const getUserFolders = async(req: Request, res: Response) => {
    const {userid} = req.params;
    if (userid === undefined) {
        res.status(400).json({ message: "Please provide userid" });
        return;
    }
    try {
        const folders = await getUserFolder(Number(userid));
        res.status(200).json({ message: "Folders retrieved successfully", data: folders });
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving folders", error: error.message });
    }
}

export const deleteFolderFun = async(req: Request, res: Response) => {
    const {folderId,userId} = req.params;
    if (folderId === undefined || userId === undefined) {
        res.status(400).json({ message: "Please provide folderId or UserId" });
        return;
    }
    try {
        const fileData = await getFilesInFolder(Number(folderId), Number(userId)) ;
        const deletePromise = fileData.map(async (file:any) => {
            const params = {
                Bucket: process.env.AWS_S3_BUCKET as string,
                Key: file.path,
            };
            await s3.deleteObject(params).promise();
        });
        await Promise.all(deletePromise);
        const delFolder = await deleteFolder(Number(folderId));

        // const folder = await deleteFolder(Number(folderId));

        res.status(200).json({ message: "Folder deleted successfully", data: delFolder });
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ message: "Error deleting folder", error: error.message });
    }

}

export const getUserFolderFiles = async(req: Request, res: Response) => {
        const {folderId, userId} = req.params;
        if (folderId === undefined || userId === undefined) {
            res.status(400).json({ message: "Please provide folderId and userId" });
            return;
        }
        try {
            const files = await getFilesInFolder(Number(folderId), Number(userId));
            res.status(200).json({ message: "Files retrieved successfully", data: files });
        } catch (error:any) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving files", error: error.message });
        }
}

export const DelfileFunction = async(req: Request, res: Response) => {
    const {userId,folderId,fileId} = req.params;
    if (folderId === undefined || fileId === undefined) {
        res.status(400).json({ message: "Please provide folderId and fileId" });
        return;
    }
    try {
        const fileData = await getFilesInFolder(Number(folderId), Number(userId)) ;
        const deletePromise = fileData.map(async (file:any) => {
            const params = {
                Bucket: process.env.AWS_S3_BUCKET as string,
                Key: file.path,
            };
            await s3.deleteObject(params).promise();
        });
        await Promise.all(deletePromise);
        const delFile = await delteFilesInFolder(Number(fileId));
        res.status(200).json({ message: "File deleted successfully", data: delFile });

        
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ message: "Error deleting file", error: error.message });
        
    }

}