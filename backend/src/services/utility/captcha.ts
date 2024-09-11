import axios from "axios";
export class CaptchaService {

  readonly secretKey: any = process.env.SECRETKEY
  readonly siteKey: any = process.env.SITEKEY

  readonly API_KEY: any = process.env.RECAPTCHA_API_KEY


  async validate(token: any) {

  const event = {
    token:token,
    siteKey: this.siteKey
  }

  const payload = JSON.stringify({event: event})
  
   return await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${this.secretKey}&response=${token}`);

  }
}

export default new CaptchaService();
