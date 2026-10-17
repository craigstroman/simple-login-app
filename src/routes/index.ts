import { Router } from 'express';
import { indexPage } from '../controllers/index/index';
import { postRegister } from '../controllers/register/register';
import { postLogin } from '../controllers/login/login';

const router = Router();

router.route('/').get(indexPage);

router.route('/register').post(postRegister);

router.route('/login').post(postLogin);

export default router;
