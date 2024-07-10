import { DataSource } from "typeorm";
import { connectWithDatabase } from "./entities";
import "reflect-metadata";
// import { CrawlerStatusService } from "./services/crawler-status.service";
// import { CrawlerStatusEntity } from "./entities/crawler-status.entity";
import { RegistryEvent } from "./enums/event.enum";
// import { EventHandler } from "./helpers/event-handler";
import { StarknetConnection } from "./helpers/starknet-connection";
import { CrawlerProcess } from "./helpers/crawler-process";
import { CrawlerType } from "./enums/crawler.enum";
import { CrawlerConstants } from "./constants/crawler.constant";

const crawlRegistry = async () => {
   let database: DataSource = await connectWithDatabase();
   let fromBlock: number = await CrawlerProcess.setUpFirstBlock(
      database,
      CrawlerType.REGISTRY,
      79600
   );
   let events = await StarknetConnection.getEvents(
      fromBlock,
      Object.values(RegistryEvent),
      CrawlerConstants.REGISTRY_CONTRACT_ADDRESS
   );
   console.log("REGISTRY REGISTRY REGISTRY REGISTRY REGISTRY REGISTRY");
   console.log(events);
   for (let event of events) {
      console.log(event.keys[0]);
      await CrawlerProcess.updateCrawlerStatus(
         event.block_number,
         database,
         CrawlerType.REGISTRY
      );
      CrawlerProcess.handleEvents(event, database, CrawlerType.REGISTRY);
   }
};

// const setUpFirstBlock = async (database: DataSource): Promise<number> => {
//    const crawlerStatusService: CrawlerStatusService = new CrawlerStatusService(
//       database
//    );
//    let crawlerStatusEntity: DeepPartial<CrawlerStatusEntity> =
//       await crawlerStatusService.getCrawlerStatus();

//    if (!crawlerStatusEntity) {
//       crawlerStatusEntity = await crawlerStatusService.createNewEntity(
//          new CrawlerStatusEntity({
//             eventSeq: 79600,
//             contractName: "",
//             contractAddress: "",
//             blockTimestamp: new Date(Date.now()),
//          }) as CrawlerStatusEntity
//       );
//    }
//    return crawlerStatusEntity.eventSeq ? crawlerStatusEntity.eventSeq : 79600;
// };

// const updateCrawlerStatus = async (
//    blocknumber: number,
//    database: DataSource
// ) => {
//    const crawlerStatusService: CrawlerStatusService = new CrawlerStatusService(
//       database
//    );
//    let crawlerStatusEntity: DeepPartial<CrawlerStatusEntity> =
//       await crawlerStatusService.getCrawlerStatus();
//    crawlerStatusEntity.eventSeq = blocknumber + 1;
//    // await crawlerStatusService.updateCrawlerStatus(crawlerStatusEntity);
// };

// const handleEvents = (event: any, dataSource: DataSource) => {
//    const eventHandler: EventHandler = new EventHandler(dataSource);
//    // switch (event) {
//    //    case EventType.NFT_MINTED: {
//    //       console.log("NFT_MINTED");
//    //       eventHandler.handleNFTMinted(event);
//    //    }
//    // }
// };

crawlRegistry();
