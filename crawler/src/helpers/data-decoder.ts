import axios from "axios";
import { EventType } from "../enums/event.enum";
import { RpcProvider, Contract } from "starknet";

export class DataDecoder {
   static async getBlockNumber() {
      const body = {
         jsonrpc: "2.0",
         method: "starknet_blockNumber",
         id: 0,
      };
      const { data } = await axios.post(CrawlerConstants.URL, body);
      return data?.result || 0;
   }

   static async getEvent({
      contractAddress,
      fromBlock,
      toBlock,
   }: any): Promise<any[]> {
      const body = {
         jsonrpc: "2.0",
         method: "starknet_getEvents",
         params: [
            {
               from_block: {
                  block_number: fromBlock,
               },
               to_block: {
                  block_number: toBlock,
               },
               address: contractAddress,
               chunk_size: 1000,
               keys: [Object.values(EventType)],
            },
         ],
         id: 1,
      };
      const { data } = await axios.post(CrawlerConstants.URL, body);
      return data?.result?.events || [];
   }

   static async getEvents({ contractAddressArray, fromBlock }: any) {
      const toBlock = Math.min(
         fromBlock + CrawlerConstants.JUMP_STEP,
         await this.getBlockNumber()
      );
      const events = [];
      console.log(`Getting events from ${fromBlock} to ${toBlock}`);
      for (const contractAddress of contractAddressArray) {
         const event = await this.getEvent({
            contractAddress,
            fromBlock,
            toBlock,
         });
         events.push(...event);
      }
      console.log(`Got ${events.length} events`);

      return { events, toBlock };
   }

   static feltToStr = (felt: number) => {
      let hex = felt.toString(16);
      if (hex.length % 2 !== 0) {
         hex = "0" + hex;
      }
      const text = Buffer.from(hex, "hex").toString("utf8");
      return text;
   };

   static feltToInt = ({ low, high }: any) => {
      return Number((BigInt(high) << 64n) + BigInt(low));
   };

   static getCollectionInformation = async ({ contractAddress } : any) => {
      const provider = new RpcProvider({
         nodeUrl: CrawlerConstants.URL,
      });
      const { abi: contractAbi } = await provider.getClassAt(contractAddress);
      if (!contractAbi) return null;
      const contractView = new Contract(contractAbi, contractAddress, provider);
      const name = await contractView.name();
      const symbol = await contractView.symbol();
      const mintPrice = await contractView.get_mint_price(1);

      return {
         address: contractAddress,
         name: this.feltToStr(name),
         symbol: this.feltToStr(symbol),
         mintPrice: Number(mintPrice),
         image: "https://i.seadn.io/s/raw/files/af7296d9d79348b19bfdb151f5698cb7.gif?auto=format&dpr=1&w=1000",
      };
   };
}
