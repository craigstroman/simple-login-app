import path from 'path';
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { v4 } from 'uuid';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { User } from '../../entities/USER';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const postRegister = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne(
      emailOrUsername.includes('@')
        ? { where: { email: emailOrUsername } }
        : { where: { username: emailOrUsername } },
    );

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Username or password is invalid.',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: "Username or password doesn't match.",
          },
        ],
      };
    }

    if (req.session) {
      req.session.userId = user?.id;
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error(error);

    return res.status(500).render('register', {
      error: 'There was a problem logging into your account.',
    });
  }
};
