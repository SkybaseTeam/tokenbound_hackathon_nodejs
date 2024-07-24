import { Contract, RpcProvider } from 'starknet';
import { nftModel } from '../models/nftModel.js';
import { tbaModel } from '../models/tbaModel.js';
import { formatStarknet } from '../utils/index.js';

export const refreshOwner = async (req, res) => {
  try {
    const { collection_address, token_id } = req.body;

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
    const owner_address = await nft_contract_view.owner_of(token_id);
    /* Done */
    await tbaModel.updateOne(
      {
        collection_address: formatStarknet(collection_address),
        token_id,
      },
      {
        owner_address: formatStarknet('0x' + owner_address.toString(16)),
      },
    );

    res.status(200).json({
      message: 'Refresh owner success',
      data: {
        token_id,
        collection_address: formatStarknet(collection_address),
        owner: formatStarknet('0x' + owner_address.toString(16)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const refreshListing = async (req, res) => {
  try {
    const { collection_address, token_id } = req.body;

    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_PROVIDER,
    });

    const { abi: market_contract_abi } = await provider.getClassAt(
      process.env.MARKET_CONTRACT,
    );
    if (!market_contract_abi) {
      return res.status(500).json({
        message: 'contract abi not found',
      });
    }

    const market_contract_view = new Contract(
      market_contract_abi,
      process.env.MARKET_CONTRACT,
      provider,
    );
    const token_listing = await market_contract_view.get_status(
      collection_address,
      token_id,
    );
    let token_price = 0;
    if (token_listing) {
      token_price =
        Number(
          await market_contract_view.get_price(collection_address, token_id),
        ) /
        10 ** 18;
    }

    await tbaModel.updateOne(
      {
        collection_address: formatStarknet(collection_address),
        token_id,
      },
      {
        price: token_price,
        listing: token_listing,
      },
    );

    return res.status(200).send({
      message: 'Refresh listing status success',
      data: {
        collection_address: formatStarknet(collection_address),
        token_id,
        listing: token_listing,
        price: token_price.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const listed = async (req, res) => {
  try {
    const marketData = await tbaModel.find({
      listing: true,
    });
    res.status(200).json({
      message: 'Get listed NFT success',
      data: marketData,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};
