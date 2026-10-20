import path from 'path';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { User } from '../../entities/USER';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const postForgotPassword = async (req: Request, res: Response) => {
  const port = process.env.PORT;
  const token = v4();
  const { email } = req.body;

  console.log('Email:', email, 'Token:', token);

  const user = await User.createQueryBuilder('user')
    .where(email.includes('@') ? 'user.email = :value' : 'user.username = :value', {
      value: email,
    })
    .getOne();

  let url: string = '';

  if (!user) {
    return 'Error';
  }

  if (process.env.NODE_ENV === 'development') {
    url = `http://localhost:${port}/change-password/${token}`;
  }

  return res.status(200).json({
    passwordResetLink: url,
  });
};
