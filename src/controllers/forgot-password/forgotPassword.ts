import path from 'path';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { User } from '../../entities/USER';
import { redis } from '../../config/redis';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const postForgotPassword = async (req: Request, res: Response) => {
  const port = process.env.PORT;
  const token = v4();
  const { email } = req.body;

  const user = await User.createQueryBuilder('user')
    .where(email.includes('@') ? 'user.email = :value' : 'user.username = :value', {
      value: email,
    })
    .getOne();

  if (user) {
    await redis.set(`forget-password: ${token}`, user.id, 'ex', 1000 * 60 * 60 * 24 * 3);
  }

  let url: string = '';

  if (!user) {
    return 'Error';
  }

  if (process.env.NODE_ENV === 'development') {
    url = `http://localhost:${port}/change-password/${token}`;
  }

  return res.status(200).json({
    passwordResetLink: url,
    token: token,
  });
};
