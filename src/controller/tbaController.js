import { RpcProvider, Contract } from 'starknet';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import { feltToStr, formatStarknet, hashValue } from '../utils/index.js';
import { tbaModel } from '../models/tbaModel.js';
import { COLLECTION_NAME, IMAGE_FOLDER_DATA } from '../constant/index.js';

cloudinary.config({
  cloud_name: 'dfnvpr9lg',
  api_key: '759248853929979',
  api_secret: 'b0nSkahJOSGf8tAA91NMsq0GaJ0',
});

export const refresh_mint_status = async (req, res) => {
  try {
    const { token_id, owner_address, collection_address } = req.body;

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
    const token_owner = await nft_contract_view.owner_of(token_id);
    const token_owner_hex = formatStarknet('0x' + token_owner.toString(16));

    if (
      formatStarknet(token_owner_hex) !==
      formatStarknet(owner_address.toLowerCase())
    ) {
      return res.status(400).json({
        message: 'NOT OWNER',
      });
    }

    const token_uri_array = await nft_contract_view.token_uri(token_id);
    const token_uri = token_uri_array.map(feltToStr).join('');

    const { abi: registry_contract_abi } = await provider.getClassAt(
      process.env.REGISTRY_CONTRACT,
    );
    if (!registry_contract_abi) return null;
    const registry_contract_view = new Contract(
      registry_contract_abi,
      process.env.REGISTRY_CONTRACT,
      provider,
    );
    const tba_address = await registry_contract_view.get_account(
      process.env.ACCOUNT_CLASSHASH,
      collection_address,
      token_id,
    );
    console.log(
      token_id + ' ' + collection_address + ' ' + process.env.ACCOUNT_CLASSHASH,
    );
    const tba_address_hex = formatStarknet('0x' + tba_address.toString(16));

    // create new image
    const { tba: tbaFolderData } = IMAGE_FOLDER_DATA;
    const pickedImage = `${process.env.IMAGE_URL}/${tbaFolderData.folder}/${tbaFolderData.folder}${hashValue(token_id, tbaFolderData.end)}.png`;
    const data = await cloudinary.uploader.upload(
      pickedImage,
      {
        folder: 'tba',
        public_id: `tba${token_id}`,
      },
      (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          return;
        }
        console.log('Upload successful:', result);
      },
    );
    // console.log('Cloudinary data:', data);

    // const { data: nft_metadata } = await axios.get(token_uri);

    const tbaData = await tbaModel.create({
      tba_address: tba_address_hex,
      collection_address: formatStarknet(collection_address),
      token_id,
      owner_address: token_owner_hex,
      tba_name: `${COLLECTION_NAME} #${token_id}`,
      tba_image: data.secure_url,
      genesis_image: pickedImage,
    });

    res.status(200).json({
      message: 'Refresh mint status successfully',
      data: tbaData,
    });
  } catch (err) {
    console.log('Get fucking error: ' + err);
    res.status(500).json({
      message: err.toString(),
    });
  }
};

export const sortByPower = async (req, res) => {
  try {
    const { page, limit } = req.query;

    let tbaData;
    let totalCount;

    if (page && limit) {
      const skip = (page - 1) * limit;

      tbaData = await tbaModel
        .find({})
        .sort({ power: -1, tba_name: 1 })
        .skip(skip)
        .limit(limit);

      totalCount = await tbaModel.countDocuments({});
    } else {
      tbaData = await tbaModel.find({}).sort({ power: -1 });
    }

    const startRank = (Number(page) - 1) * Number(limit) + 1;
    const mappedTbaData = tbaData.map((item, index) => ({
      ...item.toObject(),
      rank: startRank + index,
    }));

    /* Done */
    res.status(200).json({
      message: 'Get rank success',
      data: mappedTbaData,
      pagination: {
        currentPage: page,
        limit,
        total: totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const all = async (req, res) => {
  try {
    const address = formatStarknet(req.params.address).toLowerCase();
    const { page, limit, listing } = req.query;

    let tbaData;
    let totalCount;
    let hasMore;

    if (page && limit) {
      const skip = (page - 1) * limit;

      tbaData = await tbaModel
        .find({
          listing: listing || { $ne: null },
        })
        .skip(skip)
        .limit(limit);

      totalCount = await tbaModel.countDocuments({
        listing: listing || { $ne: null },
      });
      hasMore = page * limit < totalCount;
    } else {
      tbaData = await tbaModel.find({
        owner_address: address,
        listing: listing || { $ne: null },
      });
      hasMore = false;
    }

    /* Done */
    res.status(200).json({
      message: 'Get profile success',
      data: tbaData,
      pagination: {
        currentPage: page,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const uploadImage = async (req, res) => {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(500).json({ message: 'Error parsing form data' });
      }
      const file = files.image;
      const token_id = Number(fields.token_id[0]);
      // const existingImageUrl = `${process.env.IMAGE_URL}/tba/tba${fields.token_id}`;

      // clear old image
      const tba = await tbaModel.findOne({
        token_id,
      });
      const existingImageUrl = tba.tba_image;
      const publicId = 'tba/' + existingImageUrl.split('/').pop().split('.')[0]; // get img name from url
      // await cloudinary.uploader.destroy(publicId);
      // Upload new image
      const result = await cloudinary.uploader.upload(file[0].filepath, {
        format: 'png',
        overwrite: true, // allow override
        public_id: publicId,
        // invalidate: 'true',
      });
      console.log('result', result);
      await tbaModel.updateOne(
        {
          token_id,
        },
        {
          tba_image: result.secure_url,
        },
      );

      // delete file after upload
      fs.unlinkSync(file[0].filepath);

      res
        .status(200)
        .json({ message: 'Upload successful', url: result.secure_url });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      res.status(500).json({ message: 'Error uploading to Cloudinary', error });
    }
  });
};
