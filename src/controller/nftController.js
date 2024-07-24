import axios from 'axios';
import { Contract, RpcProvider } from 'starknet';
import { nftModel } from '../models/nftModel.js';
import { tbaModel } from '../models/tbaModel.js';
import { formatStarknet, feltToStr } from '../utils/index.js';
import { IMAGE_FOLDER_DATA } from '../constant/index.js';

export const refresh_mint_status = async (req, res) => {
  try {
    const collection_address = formatStarknet(req.body.collection_address);
    const token_id = req.body.token_id;
    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_PROVIDER,
    });

    const { abi: nft_contract_abi } =
      await provider.getClassAt(collection_address);
    if (!nft_contract_abi) {
      return res.status(500).json({
        message: 'contract abi not found',
      });
    }

    const nft_contract_view = new Contract(
      nft_contract_abi,
      collection_address,
      provider,
    );

    const owner_address_bigNum = await nft_contract_view.owner_of(token_id);
    const owner_address = formatStarknet(
      '0x0' + owner_address_bigNum.toString(16),
    );
    const token_metadata = await nft_contract_view.get_token_metadata(token_id);
    const token_uri_array = await nft_contract_view.token_uri(token_id);
    const token_uri = token_uri_array.map(feltToStr).join('');
    const { data: token_uri_data } = await axios.get(token_uri);

    // await tbaModel.findOneAndUpdate(
    //   { tba_address: owner_address },
    //   { $inc: { power: Number(token_metadata[2]) } },
    // );

    const nftData = await nftModel.create({
      collection_address,
      token_id,
      owner_address,
      nft_name: token_uri_data.name || `Tokenbound Item #${token_id}`,
      nft_image: token_uri_data.image,
      nft_type: Number(token_metadata[0]),
      nft_rank: Number(token_metadata[1]),
      power: Number(token_metadata[2]),
    });

    res.status(200).json({
      message: 'Refresh mint status successfully',
      data: nftData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err: err.message,
    });
  }
};

export const refreshEquip = async (req, res) => {
  try {
    // Get params
    const tbaAddress = formatStarknet(req.body.tba_address);
    const { slot, token_id } = req.body;

    // Initial Contract
    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_PROVIDER,
    });

    const { abi: tba_contract_abi } = await provider.getClassAt(tbaAddress);
    if (!tba_contract_abi) {
      return res.status(500).json({
        message: 'contract abi not found',
      });
    }

    const tba_contract_view = new Contract(
      tba_contract_abi,
      tbaAddress,
      provider,
    );

    // Check if NFT is equipped on contract
    const data = await tba_contract_view.get_equipped_item(slot);
    const nftEquipped = Number(data[0]);

    if (Number(token_id) !== nftEquipped) {
      console.log(Number(token_id), nftEquipped);
      return res.status(500).send({
        message: 'NFT not equipped',
      });
    }

    // Set all NFT equip status of type to false
    await nftModel.updateMany(
      {
        nft_type: slot,
        owner_address: tbaAddress,
      },
      { $set: { equip: false } },
    );

    // Set NFT equip token_id status to true
    await nftModel.updateOne({ token_id }, { $set: { equip: true } });

    // Calculate and update TBA power
    const equippedNft = await nftModel.find({
      owner_address: tbaAddress,
      equip: true,
    });
    const tbaPower = equippedNft.reduce((acc, curr) => acc + curr.power, 0);

    await tbaModel.findOneAndUpdate(
      { tba_address: tbaAddress },
      { power: tbaPower },
    );

    // Done
    res.status(200).json({
      message: 'Refresh Equip status successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err: err.message,
    });
  }
};

export const get_nft = async (req, res) => {
  const { type, equip } = req.query;

  let nftData;
  try {
    if (!req.params.tba_address) {
      nftData = await nftModel.find({
        nft_type: type || { $ne: null },
        equip: equip || { $ne: null },
      });
    } else {
      const tbaAddress = formatStarknet(req.params.tba_address);
      nftData = await nftModel
        .find({
          owner_address: tbaAddress.toLowerCase(),
          nft_type: type || { $ne: null },
          equip: equip || { $ne: null },
        })
        .sort({ nft_rank: -1 });
    }

    /* Done */
    res.status(200).json({
      message: 'Get nft success',
      data: nftData,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};
