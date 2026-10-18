import path from 'path';
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { User } from '../../entities/USER';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const postRegister = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    const hashedPassword = await argon2.hash(password);

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
