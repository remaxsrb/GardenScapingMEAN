import express from "express";
import { UserController } from "../../controllers/models/user"; 
const userRouter = express.Router();


userRouter.route('/register').post(
    (req, res) => new UserController().register(req, res)
)

userRouter.route('/read_by_username/:username').get(
    (req, res) => new UserController().readByUsername(req, res)
)

userRouter.route('/read_by_email/:email').get(
    (req, res) => new UserController().readByEmail(req, res)
)
userRouter.route('/read_by_role/:role').get(
    (req, res) => new UserController().readByRole(req, res)
)

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
)
userRouter.route('/update_firstname').post(
    (req, res) => new UserController().updateFirstname(req, res)
)
userRouter.route('/update_lastname').post(
    (req, res) => new UserController().updateLastname(req, res)
)
userRouter.route('/update_address').post(
    (req, res) => new UserController().updateAddress(req, res)
)
userRouter.route('/update_email').post(
    (req, res) => new UserController().updateEmail(req, res)
)
userRouter.route('/update_creditCardNumber').post(
    (req, res) => new UserController().updateCreditCardNumber(req, res)
)
userRouter.route('/update_profilePhoto').post(
    (req, res) => new UserController().updateProfilePhoto(req, res)
)
userRouter.route('/update_password').post(
    (req, res) => new UserController().changePassword(req, res)
)

userRouter.route('/update_username').post(
    (req, res) => new UserController().updateUsername(req, res)
)

userRouter.route('/update_phone_number').post(
    (req, res) => new UserController().updatePhoneNumber(req, res)
)

userRouter.route('/update_status').post(
    (req, res) => new UserController().updateStatus(req, res)
)

userRouter.route('/count/:role').get(
    (req, res) => new UserController().count_by_role(req, res)
)


export default userRouter;