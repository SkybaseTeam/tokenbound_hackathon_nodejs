import { constants, Contract, RpcProvider, typedData } from 'starknet';
import crypto from 'crypto';

export const getToken = (req) => {
  const token = req.headers.authorization.split(' ')[1];
  return token;
};

export const feltToStr = (felt) => {
  let hex = felt.toString(16);
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  const text = Buffer.from(hex, 'hex').toString('utf8');
  return text;
};

// export const feltToInt = ({ low, high }) => {
//   return Number((BigInt(high) << 64n) + BigInt(low));
// };

export const formatStarknet = (address) => {
  if (!address) return '';
  return (
    address.split('x')[0] +
    'x' +
    '0'.repeat(66 - address.length) +
    address.split('x')[1]
  );
};

export const verifySignatureStarknet = async (dataSign) => {
  const provider = new RpcProvider({
    nodeUrl: process.env.RPC_PROVIDER,
  });
  const { walletAddress, signature, signData } = dataSign;
  const signer = formatStarknet(signData.message.signer);

  if (Number(signData.message.expire) < Date.now()) {
    return false;
  }

  if (signer !== walletAddress) {
    return false;
  }

  const { abi: contractAbi } = await provider.getClassAt(walletAddress);

  if (!contractAbi) {
    return false;
  }

  const accountContract = new Contract(contractAbi, walletAddress, provider);
  const messageHash = typedData.getMessageHash(signData, walletAddress);

  const verify = await accountContract.is_valid_signature(
    messageHash,
    signature,
  );

  return Number(verify) !== 0;
};

export const randomNumber = (x, y) => {
  const min = Math.ceil(Math.min(x, y));
  const max = Math.floor(Math.max(x, y));
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateRandomArray = (size, min, max) => {
  const randomArray = Array.from(
    { length: size },
    () => Math.floor(Math.random() * (max - min + 1)) + min,
  );
  return randomArray;
};

export const hashValue = (input, maxValueOutput) => {
  const hash = crypto
    .createHash('sha256')
    .update(input.toString())
    .digest('hex');

  const intValue = parseInt(hash, 16);

  const mappedValue = (intValue % maxValueOutput) + 1;
  return mappedValue;
};
