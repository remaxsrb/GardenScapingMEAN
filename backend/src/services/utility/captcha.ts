import axios from "axios";
export class CaptchaService {

  readonly secretKey: any = process.env.SECRETKEY

  async validate(token: any) {
   return await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${this.secretKey}&response=${token}`);

  }
}

export default new CaptchaService();
