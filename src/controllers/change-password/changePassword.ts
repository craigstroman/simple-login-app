import path from 'path';
import { Request, Response } from 'express';
import argon2 from 'argon2';
import { User } from '../../entities/USER';
import { validatePassword } from '../../config/validatePassword';
import { redis } from '../../config/redis';

export const changePassword = async (req: Request, res: Response) => {
  const { password, token } = req.body;

  if (!validatePassword(password)) {
    return res.status(500).json({
      error: 'Password must contain at least 12 characters, ' + 'one number, and one special character.',
    });
  }

  const key = 'forget-password:' + token;
  const userId = await redis.get(key);

  if (!userId) {
    return res.status(500).json({
      error: 'Token expired or invalid.',
    });
  }

  const userIdNum = parseInt(userId);
  const user = await User.findOne(userIdNum);

  if (!user) {
    return res.status(500).json({
      error: 'User no longer exists.',
    });
  }

  user.password = await argon2.hash(password);
  await User.update(
    { id: userIdNum },
    {
      password: await argon2.hash(password),
    },
  );

  await redis.del(key);

  // log in user after change password
  if (req.session) {
    req.session.userId = user.id;
  }

  return { user };
};
