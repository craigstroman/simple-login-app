import { Router } from 'express';
import { indexPage } from '../controllers/index/index';
import { postRegister } from '../controllers/register/register';
import { PostLogin } from '../controllers/login/login';

const router = Router();

router.route('/').get(indexPage);

router.route('/register').post(postRegister);

router.route('/login').post(PostLogin);

export default router;
