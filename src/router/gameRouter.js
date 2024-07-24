import express from 'express';
import * as gameController from '../controller/gameController.js';

const router = express.Router();

router.post('/login', gameController.login);
router.post('/update-point', gameController.updatePoint);
router.post('/claim-bling', gameController.claim);
router.get('/get-reward-process/:address', gameController.getRewardProcess);
router.get('/profile/:address', gameController.gameProfile);

export default router;
