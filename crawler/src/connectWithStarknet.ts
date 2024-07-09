import { RpcProvider, constants } from "starknet";
import { EventType } from "./enums/event.enum";
// import { CrawlerStatusService } from "./services/crawler-status.service";
// import { DataSource, DeepPartial } from "typeorm";
// import { CrawlerStatusEntity } from "./entities/crawler-status.entity";

export const crawlNFTMinted = async (
   fromBlock: number,
   // database: DataSource
) => {
   console.log(`Start crawling event Scout`);
   const providerRPC = new RpcProvider({
      nodeUrl: constants.NetworkName.SN_SEPOLIA,
   }); // for an Infura node on Testnet

   const lastBlock = fromBlock;
   const nextCursor: number =
      Number(lastBlock) + 100 < Number(lastBlock)
         ? Number(lastBlock)
         : Number(lastBlock) + 100;
   // const keyFilter =
   //    "0x1b7a77b0f37dc0e29b0cf20d9fe0f095e0f060dadc86c226f2e8048a775d816";
   const { NFT_ADDRESS } = process.env;
   let nftAddress: string =
      NFT_ADDRESS ||
      "0x04fbc43ca36833a382c1e2f5d1d4bb82c84abe8a78f69eea0986f6994b7cbf62";
   const eventsList = await providerRPC.getEvents({
      address: nftAddress,
      from_block: { block_number: Number(lastBlock) },
      to_block: { block_number: nextCursor },
      keys: [Object.values(EventType)],
      chunk_size: 100,
   });

   console.log(`DONE crawling event Point from ${lastBlock} to ${nextCursor}`);

   return eventsList.events;
};
