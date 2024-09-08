import Comment from "../models/comment"


export class CommentService {
  async create(comment: any) {
    return await Comment.create(comment)
  }

  async getComments(user: string, type: string, page: number, limit: number, finishDate?: Date) {
    const skip = (page - 1) * limit;
    
    const query: any = { user, type };

    if(type === 'review') 
      return await Comment.find(query).sort({ finishDate: -1 }).skip(skip).limit(limit);
    
    return await Comment.find(query).skip(skip).limit(limit);;

  }

  async countDocuments(user:string, type:string) {
    return await Comment.countDocuments({ $and: [{ user }, { type }] });
  }

}




export default new CommentService()