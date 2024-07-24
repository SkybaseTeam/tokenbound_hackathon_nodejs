import express from 'express';
import * as tbaController from '../controller/tbaController.js';

const router = express.Router();

router.post('/refresh-mint-status', tbaController.refresh_mint_status);
router.get('/rank', tbaController.sortByPower);
router.get('/all', tbaController.all);
router.post('/upload', tbaController.uploadImage);

export default router;
