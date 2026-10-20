import { Request, Response } from 'express';

export const postLogout = async (req: Request, res: Response) => {
  return new Promise((resolve) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        res.clearCookie('uid');
        if (err) {
          console.log('There was an issue destroying the session.');
          console.log('err: ', err);
          resolve(false);
          return;
        }
        resolve(true);

        res.status(200).json({
          message: 'Successfully logged out',
        });
      });
    }
  });
};
