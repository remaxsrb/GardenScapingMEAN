import express from 'express';

import { FileController } from '../../controllers/utility/file';
import fileService from '../../services/utility/file'

const fileRouter = express.Router();



fileRouter.route('/upload').post( fileService.multerUpload.single('file'),
    (req, res) => new FileController().uploadFile(req, res)
)

fileRouter.route('/getFile').get(
    (req, res) => new FileController().serveFile(req, res)
)

fileRouter.route('/getFilePath').get(
    (req, res) => new FileController().serveFilePath(req, res)
)


export default fileRouter;
