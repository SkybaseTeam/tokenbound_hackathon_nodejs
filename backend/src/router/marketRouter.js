import express from 'express';
import * as marketController from '../controller/marketController.js';

const router = express.Router();

router.get('/listed', marketController.listed);
router.get('/mint', marketController.mint);

export default router;
