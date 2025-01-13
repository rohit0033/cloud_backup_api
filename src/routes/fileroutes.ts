import multer from 'multer';
import express from 'express';
import { downloadFile, uploadFile } from '../controllers/fileController';
import { createFolderFun, deleteFolderFun, DelfileFunction, getUserFolderFiles, getUserFolders } from '../controllers/folderController';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 200
    }
})
// ToDo: Add middelware and store the token in cookies 

router.post('/upload', upload.single('file'), uploadFile);
router.get('/download/*', downloadFile);

router.post('/folder', createFolderFun);
router.get('/folder/:userid', getUserFolders);

router.get('/folder/:userId/:folderId', getUserFolderFiles);

router.delete('/folder/:folderId/:userId', deleteFolderFun);
router.delete('/folder/:userId/:folderId/:fileId', DelfileFunction);

export default router;

