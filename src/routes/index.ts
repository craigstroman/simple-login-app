import { Router } from 'express';
import { indexPage } from '../controllers/index/index';
import { postRegister } from '../controllers/register/register';
import { postLogin } from '../controllers/login/login';
import { postLogout } from '../controllers/logout/logout';

const router = Router();

router.route('/').get(indexPage);

router.route('/register').post(postRegister);

router.route('/login').post(postLogin);

router.route('/logout').post(postLogout);

export default router;
