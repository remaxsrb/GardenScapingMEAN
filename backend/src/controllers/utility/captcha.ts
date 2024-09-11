import { Request, Response } from "express";
import captchaService from "../../services/utility/captcha";

export class CaptchaController {
  async validate(req: Request, res: Response) {
    const token = req.body.token;


    try {
      const response = await captchaService.validate(token);

      console.log(response.data.success)

      if (response.data.success) {
        // CAPTCHA is valid, proceed with form processing
        res.status(200).send("CAPTCHA verification succeeded");
      } else {
        // CAPTCHA is invalid
        res.status(400).send("CAPTCHA verification failed");
      }
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
}
