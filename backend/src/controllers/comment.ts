import express from "express";
import commentService from "../services/comment";
export class CommentController {
  async create(req: express.Request, res: express.Response) {
    try {
      await commentService.create(req.body);
      return res.json({ status: 201, message: "Comment  created" });
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error creating comment";
      return res.status(statusCode).json({ message });
    }
  }

  async getReviewComments(req: express.Request, res: express.Response) {

    const user = req.query.user as string
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    const comments = await commentService.getComments(user, 'review', page, limit)

    const totalDocuments = await commentService.countDocuments(user, 'review');

  }


  async getRejectionComments(req: express.Request, res: express.Response) {

    const user = req.query.user as string
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    const comments = await commentService.getComments(user, 'rejection', page, limit)

    const totalDocuments = await commentService.countDocuments(user, 'rejection');

  }
}

export default new CommentController();
