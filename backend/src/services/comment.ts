import Comment from "../models/comment"


export class CommentService {
  async create(comment: any) {
    return await Comment.create(comment)
  }

  async getComments(user:string, type:string, page:number, limit:number) {
    const skip = (page - 1) * limit;
    return await Comment.find({ $and: [{ user }, { type }] }).skip(skip).limit(limit)
  }

  async countDocuments(user:string, type:string) {
    return await Comment.countDocuments({ $and: [{ user }, { type }] });
  }

}




export default new CommentService()