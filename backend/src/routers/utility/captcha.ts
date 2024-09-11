import express from 'express';

import { CaptchaController } from '../../controllers/utility/captcha';
import captcaService from '../../services/utility/captcha'

const captchaRouter = express.Router();



captchaRouter.route('/validate').post( 
    (req, res) => new CaptchaController().validate(req, res)
)




export default captchaRouter;
