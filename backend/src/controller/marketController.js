import { collectionModel } from '../models/collectionModel.js';
import { nftModel } from '../models/nftModel.js';

export const listed = async (req, res) => {
  try {
    const marketData = await nftModel.find({
      listing: true,
    });
    /* Done */
    res.status(200).json({
      message: 'Get listed NFT success',
      data: marketData,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const mint = async (req, res) => {
  try {
    /* fake data */
    /*  await collectionModel.create({
      collection_address:
        '0x00a01c352fd150d184835c727a84adfaf047838271e8641da6ea5156f7f73dce',
      name: 'Meme Land',
      image: 'https://grow-api.memeland.com/token/images/5.gif',
      mint_price: '1',
    }); */
    // await nftModel.deleteMany({ listing: true });
    const collectionData = await collectionModel.find({});
    /* Done */
    res.status(200).json({
      message: 'Get collection data success',
      data: collectionData,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};
