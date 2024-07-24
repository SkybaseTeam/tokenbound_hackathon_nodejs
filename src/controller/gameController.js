import { Contract, RpcProvider, ec, num } from 'starknet';
import jwt from 'jsonwebtoken';
import { poseidonHashMany } from '@scure/starknet';
import { tbaModel } from '../models/tbaModel.js';
import { formatStarknet, verifySignatureStarknet } from '../utils/index.js';

export const login = async (req, res) => {
  const { token_id, signature, sign_data } = req.body;
  const tba_address = formatStarknet(req.body.tba_address);
  const address = formatStarknet(req.body.address);

  try {
    // verify signature
    const isVerified = await verifySignatureStarknet({
      walletAddress: address,
      signature,
      signData: sign_data,
    });
    if (!isVerified) {
      throw new Error('Can not verify signature');
    }

    // verify tba owner
    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_PROVIDER,
    });

    const { abi: nft_contract_abi } = await provider.getClassAt(
      process.env.NFT_CONTRACT,
    );
    if (!nft_contract_abi) {
      return res.status(500).json({
        message: 'contract abi not found',
      });
    }

    const nft_contract_view = new Contract(
      nft_contract_abi,
      process.env.NFT_CONTRACT,
      provider,
    );
    const token_owner = await nft_contract_view.owner_of(token_id);

    const token_owner_hex = formatStarknet('0x' + token_owner.toString(16));

    if (token_owner_hex !== address.toLowerCase()) {
      return res.status(400).json({
        message: 'NOT OWNER',
      });
    }

    /* Render JWT */
    const token = jwt.sign(
      {
        data: address,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '365d',
      },
    );

    /* Done */
    const tba = await tbaModel.find({
      tba_address,
    });

    res.status(200).json({
      message: 'Login success',
      data: { tba, token },
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const gameProfile = async (req, res) => {
  const tba_address = formatStarknet(req.params.address);

  try {
    /* Done */
    const tba = await tbaModel.findOne({
      tba_address,
    });

    res.status(200).json({
      message: 'Get profile success',
      data: tba,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const updatePoint = async (req, res) => {
  try {
    const { tba_address, point } = req.body;
    const tba = await tbaModel.updateOne(
      {
        tba_address: formatStarknet(tba_address),
      },
      {
        point,
      },
    );
    /* Done */
    res.status(200).json({
      message: 'Update point success',
      data: tba,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    console.log('Get fucking error: ' + error);
  }
};

export const getRewardProcess = async (req, res) => {
  try {
    const account_contract = formatStarknet(req.params.address);

    const provider = new RpcProvider({
      nodeUrl: process.env.RPC_PROVIDER,
    });

    const { abi: token_contract_abi } = await provider.getClassAt(
      process.env.ERC20_CONTRACT,
    );
    if (!token_contract_abi) {
      return res.status(500).json({
        message: 'contract abi not found',
      });
    }

    const token_contract_view = new Contract(
      token_contract_abi,
      process.env.ERC20_CONTRACT,
      provider,
    );
    const rewardProcess = Number(
      await token_contract_view.get_minted(account_contract),
    );
    await tbaModel.updateOne(
      {
        tba_address: account_contract,
      },
      {
        claimed: rewardProcess,
      },
    );

    res.status(200).send({
      process: rewardProcess,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err.toString() || 'Something went wrong',
    });
  }
};

const signMint = async ({ contract, account, index }) => {
  const message = [
    num.toBigInt(contract),
    num.toBigInt(account),
    num.toBigInt(index),
  ];
  const msgHash = num.toHex(poseidonHashMany(message));
  const signature = ec.starkCurve.sign(msgHash, process.env.PRIVATE_SIGNER);
  return {
    message_hash: msgHash,
    signature: {
      r: String(signature.r),
      s: String(signature.s),
    },
  };
};

export const claim = async (req, res) => {
  try {
    const bling_contract = formatStarknet(req.body.bling_contract);
    const account_contract = formatStarknet(req.body.account_contract);
    const found_tba = await tbaModel.findOne({ tba_address: account_contract });
    if (!found_tba) {
      return res.status(400).send({
        error: 'TBA not found',
      });
    }

    const point = found_tba.point;
    const claimed = found_tba.claimed;

    if (point < (claimed + 1) * 5) {
      return res.status(400).send({
        error: 'Already claimed all rewards',
      });
    }

    const hash_data = await signMint({
      contract: bling_contract,
      account: account_contract,
      index: found_tba.claimed + 1,
    });
    res.status(200).send(hash_data);
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
