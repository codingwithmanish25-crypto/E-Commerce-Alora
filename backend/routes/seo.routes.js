import express from 'express';
import { createPost, uploadEditorImage } from '../controllers/post.controllers.js';
import { upload } from '../middleware/uploadmiddleware.js';

const router = express.Router();

const cpUpload = upload.fields([
    { name: 'coverImageFile', maxCount: 1 },
    { name: 'ogImageFile', maxCount: 1 }
]);

router.post('/create', cpUpload, createPost);
router.post('/upload-editor-img', upload.single('editorImage'), uploadEditorImage);

export default router;