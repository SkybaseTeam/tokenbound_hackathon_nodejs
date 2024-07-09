import { DataSource, DeepPartial } from "typeorm";
import { connectWithDatabase } from "./entities";
import { crawlNFTMinted } from "./connectWithStarknet";
import "reflect-metadata";
import { CrawlerStatusService } from "./services/crawler-status.service";
import { CrawlerStatusEntity } from "./entities/crawler-status.entity";
import { EventType } from "./enums/event.enum";
import { EventHandler } from "./helpers/event-handler";
// import axios from "axios";

const startApp = async () => {
   let database: DataSource = await connectWithDatabase();
   let fromBlock: number = await setUpFirstBlock(database);
   let events = await crawlNFTMinted(fromBlock);
   console.log("------------------------------------------------------------");
   console.log(events);
   for (let event of events) {
      console.log(event.keys[0]);
      await updateCrawlerStatus(event.block_number, database);
      handleEvents(event, database);
   }
};

const setUpFirstBlock = async (database: DataSource): Promise<number> => {
   const crawlerStatusService: CrawlerStatusService = new CrawlerStatusService(
      database
   );
   let crawlerStatusEntity: DeepPartial<CrawlerStatusEntity> =
      await crawlerStatusService.getCrawlerStatus();

   if (!crawlerStatusEntity) {
      crawlerStatusEntity = await crawlerStatusService.createNewEntity(
         new CrawlerStatusEntity({
            eventSeq: 77000,
            contractName: "",
            contractAddress: "",
            blockTimestamp: new Date(Date.now()),
         }) as CrawlerStatusEntity
      );
   }
   return crawlerStatusEntity.eventSeq ? crawlerStatusEntity.eventSeq : 77000;
};

const updateCrawlerStatus = async (
   blocknumber: number,
   database: DataSource
) => {
   const crawlerStatusService: CrawlerStatusService = new CrawlerStatusService(
      database
   );
   let crawlerStatusEntity: DeepPartial<CrawlerStatusEntity> =
      await crawlerStatusService.getCrawlerStatus();
   crawlerStatusEntity.eventSeq = blocknumber+1;
   await crawlerStatusService.updateCrawlerStatus(crawlerStatusEntity);
};

const handleEvents = (event: any, dataSource: DataSource) => {
   const eventHandler: EventHandler = new EventHandler(dataSource);
   switch (event) {
      case EventType.NFT_MINTED: {
         console.log("NFT_MINTED");
         eventHandler.handleNFTMinted(event);
      }
   }
};

startApp();
