import { Router } from 'express';
import { indexPage } from '../controllers/index/index';
import { postRegister } from '../controllers/register/register';

const router = Router();

router.route('/').get(indexPage);

router.route('/register').post(postRegister);

export default router;
