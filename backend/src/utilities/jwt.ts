import jwt from 'jsonwebtoken';

const secretKey = 'Naruto_D_Kurosaki'; //write your secret key

class jwt_service {
  generate_token(user: any): string {
    const data = {
      username: user.username,
      role: user.role,
    };

    const options = {
      expiresIn: '5h',
    };

    return jwt.sign(data, secretKey, options);
  }
}

export default new jwt_service();