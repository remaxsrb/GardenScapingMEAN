import express from "express";
import { FirmController } from "../../controllers/models/firm"; 
const firmRouter = express.Router();

firmRouter.route('/create').post(
    (req, res) => new FirmController().create(req, res)
)

firmRouter.route('/get').get(
    (req, res) => new FirmController().get(req, res)
)

firmRouter.route('/search').get(
    (req, res) => new FirmController().search(req, res)
)

firmRouter.route('/rate').post(
    (req, res) => new FirmController().rate(req, res)
)

firmRouter.route('/getname').get(
    (req, res) => new FirmController().getName(req, res)
)




firmRouter.route('/all').get(
    (req, res) => new FirmController().getIdName(req, res)
)


export default firmRouter;