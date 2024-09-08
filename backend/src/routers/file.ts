import express from "express";
import { FileController } from "../controllers/file"; 
const fileRouter = express.Router();

fileRouter.route('/save').post(
    (req, res) => new FileController().saveText(req, res)
)

export default fileRouter; 