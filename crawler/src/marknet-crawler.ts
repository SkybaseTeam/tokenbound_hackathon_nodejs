import { DataSource } from "typeorm";
import { connectWithDatabase } from "./entities";
import "reflect-metadata";
import { RegistryEvent } from "./enums/event.enum";
import { CrawlerProcess } from "./helpers/crawler-process";
import { CrawlerType } from "./enums/crawler.enum";
import { CrawlerConstants } from "./constants/crawler.constant";

const crawlMarket = async () => {
   let database: DataSource = await connectWithDatabase();
   let fromBlock: number = await CrawlerProcess.setUpFirstBlock(
      database,
      CrawlerType.MARKET,
      79000
   );
   let events = await CrawlerProcess.getEvents(
      fromBlock,
      Object.values(RegistryEvent),
      CrawlerConstants.MARKET_CONTRACT_ADDRESS
   );

   const latestBlocknumber: number = await CrawlerProcess.getBlockNumber();
   await CrawlerProcess.updateCrawlerStatus(
      fromBlock + 100 < latestBlocknumber ? fromBlock + 100 : latestBlocknumber,
      database,
      CrawlerType.MARKET
   );

   console.log("MARKET MARKET MARKET MARKET MARKET MARKET MARKET MARKET MARKET");
   console.log(events);

   for (let event of events) {
      console.log(event.keys[0]);
      CrawlerProcess.handleEvents(event, database, CrawlerType.MARKET);
   }
};

crawlMarket();