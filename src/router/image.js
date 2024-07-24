import express from 'express';
import * as imageController from '../controller/imageController.js';

const router = express.Router();

router.get('/nft/:token_id', imageController.nft);
router.get('/tba/:token_id', imageController.tba);

export default router;
