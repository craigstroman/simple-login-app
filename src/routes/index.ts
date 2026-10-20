import { Router } from 'express';
import { indexPage } from '../controllers/index/index';
import { postRegister } from '../controllers/register/register';
import { postLogin } from '../controllers/login/login';
import { postLogout } from '../controllers/logout/logout';
import { postForgotPassword } from '../controllers/forgot-password/forgotPassword';

const router = Router();

router.route('/').get(indexPage);

router.route('/register').post(postRegister);

router.route('/login').post(postLogin);

router.route('/logout').post(postLogout);

router.route('/forgot-password').post(postForgotPassword);

export default router;
