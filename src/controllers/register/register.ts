import path from 'path';
import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { User } from '../../entities/USER';
import { validatePassword } from '../../config/validatePassword';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const postRegister = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    const existingUser = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email })
      .getOne();

    if (existingUser) {
      return res.status(500).json({
        error: 'Username or email already taken.',
      });
    }

    if (!validatePassword(password)) {
      return res.status(500).json({
        error: 'Password must contain at least 12 characters, ' + 'one number, and one special character.',
      });
    }

    if (username.length <= 2) {
      return res.status(500).json({
        error: `Username must be greater than 2 characters long..`,
      });
    }

    if (password.length <= 2) {
      return res.status(500).json({
        error: `Password length must be greater than 2 characters long.'`,
      });
    }

    const hashedPassword = await argon2.hash(password);

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: hashedPassword,
      })
      .returning('*')
      .execute();

    console.log('result:', result);

    const user = result.raw[0];

    if (req.session) {
      req.session.userId = user?.id;
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'There was a problem creating your account.',
    });
  }
};
