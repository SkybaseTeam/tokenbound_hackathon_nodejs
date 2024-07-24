import express from 'express';
import * as marketController from '../controller/marketController.js';

const router = express.Router();

router.post('/refresh-owner', marketController.refreshOwner);
router.post('/refresh-listing', marketController.refreshListing);
router.get('/listed', marketController.listed);

export default router;
