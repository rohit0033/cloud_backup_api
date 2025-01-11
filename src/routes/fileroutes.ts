import multer from 'multer';
import express from 'express';
import { downloadFile, uploadFile } from '../controllers/fileController';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 200
    }
})

router.post('/upload', upload.single('file'), uploadFile);
router.get('/download/*', downloadFile);

export default router;

