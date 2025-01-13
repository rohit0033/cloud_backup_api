import { Request, Response } from 'express';
import { createfolder, getFilesInFolder, getUserFolder } from '../models/folder';


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