import express from 'express';
import * as nftController from '../controller/nftController.js';

const router = express.Router();

router.post('/refresh-mint-status', nftController.refresh_mint_status);
router.post('/refresh-equip-status', nftController.refreshEquip);
router.get('/get-nft/:tba_address', nftController.get_nft);

export default router;
