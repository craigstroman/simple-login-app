import path from 'path';
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { v4 } from 'uuid';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { User } from '../../entities/USER';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const postLogin = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.createQueryBuilder('user')
      .where(emailOrUsername.includes('@') ? 'user.email = :value' : 'user.username = :value', {
        value: emailOrUsername,
      })
      .getOne();

    if (!user) {
      return res.status(500).json({
        error: `Username or password is invalid.`,
      });
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return res.status(500).json({
        error: `Username or password doesn't match.`,
      });
    }

    if (req.session) {
      req.session.userId = user?.id;
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'There was a problem logging into your account.',
    });
  }
};
