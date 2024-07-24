import { Contract, RpcProvider } from 'starknet';
import { feltToStr, hashValue } from '../utils/index.js';
import {
  COLLECTION_NAME,
  IMAGE_FOLDER_DATA,
  TYPE_MAP,
} from '../constant/index.js';
import { tbaModel } from '../models/tbaModel.js';

export const tba = async (req, res) => {
  try {
    const token_id = req.params.token_id;

    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_PROVIDER,
    });

    const { abi } = await provider.getClassAt(process.env.REGISTRY_CONTRACT);
    if (!abi) throw new Error('Invalid NFT contract address');
    const tba_contract_view = new Contract(
      abi,
      process.env.REGISTRY_CONTRACT,
      provider,
    );

    // check if exist
    const isExist = await tba_contract_view.get_account(
      process.env.ACCOUNT_CLASSHASH,
      process.env.NFT_CONTRACT,
      token_id,
    );

    /* image processing */
    const { tba: tbaFolderData } = IMAGE_FOLDER_DATA;

    const tbaFound = await tbaModel.findOne({ token_id });

    return res.status(200).json({
      tokenId: Number(token_id),
      name: `${COLLECTION_NAME} #${token_id}`,
      image: tbaFound.tba_image || process.env.UNKNOWN_IMAGE_URI,
      attributes: [],
    });
  } catch (err) {
    console.error(err);
    return res.status(200).send({
      tokenId: 0,
      name: 'Unknown NFT',
      image: process.env.UNKNOWN_IMAGE_URI,
      attributes: [],
    });
  }
};

export const nft = async (req, res) => {
  try {
    const token_id = req.params.token_id;

    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_PROVIDER,
    });

    const { abi: nft_contract_abi } = await provider.getClassAt(
      process.env.NFT_ITEM_CONTRACT,
    );
    if (!nft_contract_abi) throw new Error('Invalid NFT contract address');
    const nft_contract_view = new Contract(
      nft_contract_abi,
      process.env.NFT_ITEM_CONTRACT,
      provider,
    );

    // const collection_name = feltToStr(await nft_contract_view.name());
    const metadata = await nft_contract_view.get_token_metadata(token_id);

    // check if exist
    if (Number(metadata[2]) === 0) {
      return res.status(200).send({
        tokenId: 0,
        name: 'Unknown NFT',
        image: process.env.UNKNOWN_IMAGE_URI,
        attributes: [],
      });
    }

    /* image processing */
    const { nft: nftFolderData } = IMAGE_FOLDER_DATA;

    const hashVal = Number(metadata[0]);
    const randomType = 'type_' + hashVal;
    const randomImg = hashValue(token_id, nftFolderData[randomType].end);

    const type = TYPE_MAP[Number(metadata[0])];

    return res.status(200).json({
      tokenId: Number(token_id),
      name: `${TYPE_MAP[Number(metadata[0])]} #${token_id}`,
      contract_address: process.env.NFT_ITEM_CONTRACT,
      image:
        `${process.env.IMAGE_URL}/${type}/${type}${randomImg}.png` ||
        process.env.UNKNOWN_IMAGE_URI,
      attributes: [
        {
          trait_type: 'Type',
          value: Number(metadata[0]),
        },
        {
          trait_type: 'Rank',
          value: Number(metadata[1]),
        },
        {
          trait_type: 'Power',
          value: Number(metadata[2]),
        },
      ],
    });
  } catch (err) {
    console.error(err);
    return res.status(200).send({
      tokenId: 0,
      name: 'Unknown NFT',
      image: process.env.UNKNOWN_IMAGE_URI,
      attributes: [],
    });
  }
};
