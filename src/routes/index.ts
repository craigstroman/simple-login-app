import { Router } from 'express';
import { indexPage } from '../controllers/index/index';

const router = Router();

router.get('/', indexPage);

export default router;
