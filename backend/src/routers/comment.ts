import express from "express";
import { CommentController } from "../controllers/comment"; 
const commentRouter = express.Router();

commentRouter.route('/create').post(
    (req, res) => new CommentController().create(req, res)
)

commentRouter.route('/get_reviews').get(
    (req, res) => new CommentController().getReviewComments(req, res)
)

commentRouter.route('/get_rejections').get(
    (req, res) => new CommentController().getRejectionComments(req, res)
)

export default commentRouter; 