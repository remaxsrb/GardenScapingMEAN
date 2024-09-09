import express from 'express';

import { FileController } from '../controllers/file';
import fileService from '../services/file'

const fileRouter = express.Router();



fileRouter.route('/upload').post( fileService.multerUpload.single('file'),
    (req, res) => new FileController().uploadFile(req, res)
)

fileRouter.route('/get').get(
    (req, res) => new FileController().serveFileHandler(req, res)
)


export default fileRouter;
