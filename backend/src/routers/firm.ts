import express from "express";
import { FirmController } from "../controllers/firm"; 
const firmRouter = express.Router();

firmRouter.route('/create').post(
    (req, res) => new FirmController().create(req, res)
)

firmRouter.route('/all/:page/:limit').get(
    (req, res) => new FirmController().all(req, res)
)

firmRouter.route('/rate').post(
    (req, res) => new FirmController().all(req, res)
)

firmRouter.route('/sort_by_name_asc').get(
    (req, res) => new FirmController().sort_by_name_asc(req, res)
)

firmRouter.route('/sort_by_name_desc').get(
    (req, res) => new FirmController().sort_by_name_desc(req, res)
)

firmRouter.route('/sort_by_address_asc').get(
    (req, res) => new FirmController().sort_by_address_asc(req, res)
)

firmRouter.route('/sort_by_address_desc').get(
    (req, res) => new FirmController().sort_by_address_desc(req, res)
)

firmRouter.route('/read_by_name/:name/:street/:number/:city').get(
    (req, res) => new FirmController().readByFields(req, res)
)


export default firmRouter;