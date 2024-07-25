import express from "express";
import userService from "../services/user";

export class UserController {
  async register(req: express.Request, res: express.Response) {
    console.log(req.body) //5555555555554444
    try {
      const user = await userService.register(req.body);
      console.log("User created")
      return res.json({ status: 201, message: "User  created", user });
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error creating user";
      return res.status(statusCode).json({ message });
    }
  }

  async login(req: express.Request, res: express.Response) {
    const { username, password } = req.body;
    try {
      const { token, user } = await userService.login(username, password);
      return res.status(200).json({ token, user });
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error logging in";
      return res.status(statusCode).json({ message });
    }
  }

  async updateField(req: express.Request, res: express.Response, fieldToUpdate: string, updateValue: any) {
    try {
      const result = await userService.updateField(req.body._id, fieldToUpdate, updateValue);
      return res.json(result);
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error updating user";
      return res.status(statusCode).json({ message });
    }
  }

  updateFirstname(req: express.Request, res: express.Response) {
    this.updateField(req, res, "firstname", req.body.firstname);
  }

  updateLastname(req: express.Request, res: express.Response) {
    this.updateField(req, res, "lastname", req.body.lastname);
  }

  updateAddress(req: express.Request, res: express.Response) {
    this.updateField(req, res, "address", req.body.address);
  }

  updatePhoneNumber(req: express.Request, res: express.Response) {
    this.updateField(req, res, "phone_number", req.body.phoneNumber);
  }

  updateUsername(req: express.Request, res: express.Response) {
    this.updateField(req, res, "username", req.body.username);
  }

  updateEmail(req: express.Request, res: express.Response) {
    this.updateField(req, res, "email", req.body.email);
  }

  updateCreditCardNumber(req: express.Request, res: express.Response) {
    this.updateField(req, res, "creditCardNumber", req.body.creditCardNumber);
  }

  updateProfilePhoto(req: express.Request, res: express.Response) {
    this.updateField(req, res, "profilePhoto", req.body.profilePhoto);
  }

  updatePassword(req: express.Request, res: express.Response) {
    this.updateField(req, res, "password", req.body.password);
  }

  updateStatus(req: express.Request, res: express.Response) {
    this.updateField(req, res, "status", req.body.newStatus);
  }

  async readByField(req: express.Request, res: express.Response, field: string) {
    try {
      const user = await userService.readUserByField(field, req.params[field]);
      return res.json(user);
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error fetching user";
      return res.status(statusCode).json({ message });
    }
  }

  readByUsername(req: express.Request, res: express.Response) {
    this.readByField(req, res, "username");
  }

  readByEmail(req: express.Request, res: express.Response) {
    this.readByField(req, res, "email");
  }

  async readByRole(req: express.Request, res: express.Response) {
    const { role } = req.params;
    try {
      const users = await userService.readUsersByField("role", role);
      return res.json(users);
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error fetching users";
      return res.status(statusCode).json({ message });
    }
  }

  async count_by_role(req: express.Request, res: express.Response) {
    const { role } = req.params;
    try {
      const result = await userService.countUsersByField("role", role);
      return res.json(result);
    } catch (err: any) {
      const statusCode = err.status || 500;
      const message = err.message || "Error counting users";
      return res.status(statusCode).json({ message });
    }
  }
}

export default new UserController();
