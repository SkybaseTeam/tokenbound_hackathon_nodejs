// import { EventType } from "src/enums/event.enum";
import { constants, RpcProvider } from "starknet";

export class StarknetConnection {
   public static getEvents = async (fromBlock: number, event : any, address : string) => {
      console.log(`Start crawling event Scout`);
      const providerRPC = new RpcProvider({
         nodeUrl: constants.NetworkName.SN_SEPOLIA,
      });

      const lastBlock = fromBlock;
      const nextCursor: number =
         Number(lastBlock) + 100 < Number(lastBlock)
            ? Number(lastBlock)
            : Number(lastBlock) + 100;

      // const { NFT_ADDRESS } = process.env;
      // let nftAddress: string =
      //    NFT_ADDRESS ||
      //    "0x04fbc43ca36833a382c1e2f5d1d4bb82c84abe8a78f69eea0986f6994b7cbf62";
      const eventsList = await providerRPC.getEvents({
         address: address,
         from_block: { block_number: Number(lastBlock) },
         to_block: { block_number: nextCursor },
         // keys: [Object.values(EventType)],
         keys: [event],
         chunk_size: 100,
      });

      console.log(
         `DONE crawling event Point from ${lastBlock} to ${nextCursor}`
      );

      return eventsList.events;
   };
}
