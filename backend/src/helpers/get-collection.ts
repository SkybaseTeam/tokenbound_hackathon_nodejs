import { RpcProvider, Contract } from "starknet";
import { DataDecoder } from "./data-decoder";
import { StarknetConstants } from "../constants/starknet.constant";
import { CollectionEntity } from "../entities/collection.entity";
import { DeepPartial } from "typeorm";

export class GetCollection {
   public static getCollectionInformation = async (
      contractAddress: string
   ): Promise<DeepPartial<CollectionEntity>> => {
      const provider = new RpcProvider({
         nodeUrl: StarknetConstants.URL,
      });
      const { abi: contractAbi } = await provider.getClassAt(contractAddress);
      if (!contractAbi) throw new Error(`Could not find collection`);
      const contractView = new Contract(contractAbi, contractAddress, provider);
      const name = await contractView.name();
      const symbol = await contractView.symbol();
      const mintPrice = await contractView.get_mint_price(1);

      return {
         address: contractAddress,
         name: DataDecoder.feltToStr(name),
         symbol: DataDecoder.feltToStr(symbol),
         mintPrice: Number(mintPrice) / 10 ** 18,
         image: "https://i.seadn.io/s/raw/files/af7296d9d79348b19bfdb151f5698cb7.gif?auto=format&dpr=1&w=1000",
      };
   };
}
