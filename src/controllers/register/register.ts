import { Request, Response } from 'express';

export const postRegister = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    console.log(req.body);

    console.log('firstName:', firstName);
    console.log('lastName:', lastName);
    console.log('email:', email);
    console.log('username:', username);
    console.log('password:', password);

    // Registration logic will go here

    return res.status(200).send();
  } catch (error) {
    console.error(error);

    return res.status(500).render('register', {
      error: 'There was a problem creating your account.',
    });
  }
};
