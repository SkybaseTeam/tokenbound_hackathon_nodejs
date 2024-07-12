import { DataSource } from "typeorm";
import { connectWithDatabase } from "./entities";
import "reflect-metadata";
// import { CrawlerStatusService } from "./services/crawler-status.service";
// import { CrawlerStatusEntity } from "./entities/crawler-status.entity";
import { Nft721Event } from "./enums/event.enum";
// import { EventHandler } from "./helpers/event-handler";
import { CrawlerProcess } from "./helpers/crawler-process";
import { CrawlerType } from "./enums/crawler.enum";
import { CrawlerConstants } from "./constants/crawler.constant";
import { Config } from "./config";


const config: Config = new Config();
const crawlNft721 = async () => {
   let database: DataSource = await connectWithDatabase();
   let fromBlock: number = await CrawlerProcess.setUpFirstBlock(
      database,
      CrawlerType.NFT721,
      77500
   );
   let events = await CrawlerProcess.getEvents(
      fromBlock,
      Object.values(Nft721Event),
      config.ERC721_CONTRACT_ADDRESS
   );

   const latestBlocknumber: number = await CrawlerProcess.getBlockNumber();
   await CrawlerProcess.updateCrawlerStatus(
      fromBlock + 100 < latestBlocknumber ? fromBlock + 100 : latestBlocknumber,
      database,
      CrawlerType.NFT721
   );

   console.log("NFT721 NFT721 NFT721 NFT721 NFT721 NFT721");
   console.log(events);
   for (let event of events) {
      console.log(event.keys[0]);
      // await CrawlerProcess.updateCrawlerStatus(
      //    event.block_number,
      //    database,
      //    CrawlerType.NFT721
      // );
      CrawlerProcess.handleEvents(event, database, CrawlerType.NFT721);
   }
};

crawlNft721();
