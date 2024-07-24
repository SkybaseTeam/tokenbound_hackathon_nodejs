import express from 'express';
import * as userController from '../controller/userController.js';

const router = express.Router();

router.get('/tba/:address', userController.tba);

export default router;
