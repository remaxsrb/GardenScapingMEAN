import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt_service from "../utilities/jwt";

class UserService {
  async checkExistingUser(username: string, email: string) {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username || existingUser.email === email)
        throw { status: 409, message: "Username or email are already taken" };
    }
  }

  async register(userData: any) {
    await this.checkExistingUser(userData.username, userData.email);

    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(userData.password, salt);
    userData.password = hashed_password;

    return await User.create(userData);
  }

  async login(username: string, password: string) {
    const user = await User.findOne({ username });

    if (!user) throw { status: 404, message: "User not found" };

    if (user.role === "owner" && user.status !== "active")
      throw { status: 403, message: "Owner is not approved" };

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) throw { status: 401, message: "Invalid password" };

    const token = jwt_service.generate_token(user);
    const { password: _, ...user_data } = user.toObject();
    return { token, user: user_data };
  }

  async updateField(_id: string, fieldToUpdate: string, updateValue: any) {
    if (fieldToUpdate === "username") {
      const existingUser = await User.findOne({ username: updateValue });
      if (existingUser) {
        throw { status: 409, message: "Username is already taken" };
      }
    } else if (fieldToUpdate === "email") {
      const existingUser = await User.findOne({ email: updateValue });
      if (existingUser) {
        throw { status: 409, message: "Email is already taken" };
      }
    }

    const updateQuery = { _id };
    const update = { [fieldToUpdate]: updateValue };
  
    const result = await User.updateOne(updateQuery, update);
    if (result.modifiedCount > 0) {
      return { status: 200, message: `${fieldToUpdate} updated` };
    } else {
      throw { status: 404, message: "User not found or no changes made" };
    }
  }

  async readUserByField(field: string, value: string) {
    const user = await User.findOne({ [field]: value });
    if (user) {
      return user;
    } else {
      throw { status: 404, message: "User not found" };
    }
  }

  async readUsersByField(field: string, value: string) {
    const users = await User.find({ [field]: value });
    return users;
  }

  async countUsersByField(field: string, value: string) {
    const count = await User.countDocuments({ [field]: value });
    return { count };
  }

  async changePassword(username:string, password:string) {

    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(password, salt);

    return User.findOneAndUpdate({username:username},{password:hashed_password})
    
  }

}

export default new UserService();
