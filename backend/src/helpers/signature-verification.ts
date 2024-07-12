// import { StatusCodes } from "http-status-codes";
import { constants, Contract, RpcProvider, typedData } from "starknet";

export class SignatureVerification {
   public static verifySignatureStarknet = async (dataSign: any) => {
      try {
         const provider = new RpcProvider({
            nodeUrl: constants.NetworkName.SN_SEPOLIA,
         });
         const { walletAddress, signature, signData } = dataSign;

         if (Number(signData.message.expire) < Date.now()) {
            return false;
         }

         if (signData.message.signer !== walletAddress) {
            return false;
         }

         const { abi: contractAbi } = await provider.getClassAt(walletAddress);

         if (!contractAbi) {
            return false;
         }

         const accountContract = new Contract(
            contractAbi,
            walletAddress,
            provider
         );
         const messageHash = typedData.getMessageHash(signData, walletAddress);

         const verify = await accountContract.is_valid_signature(
            messageHash,
            signature
         );

         return verify != 0 ? true : false;
      } catch (error) {
         throw error;
      }
   };
}
