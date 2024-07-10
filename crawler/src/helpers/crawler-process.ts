import { CrawlerType } from "../enums/crawler.enum";
import { CrawlerStatusEntity } from "../entities/crawler-status.entity";
import { CrawlerStatusService } from "../services/crawler-status.service";
import { DataSource, DeepPartial } from "typeorm";
import { EventHandler } from "./event-handler";
import { Nft721Event, RegistryEvent } from "../enums/event.enum";

export class CrawlerProcess {
   public static setUpFirstBlock = async (
      database: DataSource,
      crawlerType: CrawlerType,
      defaultBlocknumber: number
   ): Promise<number> => {
      const crawlerStatusService: CrawlerStatusService =
         new CrawlerStatusService(database);
      let crawlerStatusEntity: DeepPartial<CrawlerStatusEntity> =
         await crawlerStatusService.getCrawlerStatus(crawlerType);

      if (!crawlerStatusEntity) {
         crawlerStatusEntity = await crawlerStatusService.createNewEntity(
            new CrawlerStatusEntity({
               eventSeq: defaultBlocknumber,
               contractName: crawlerType,
               contractAddress: "",
               blockTimestamp: new Date(Date.now()),
            }) as CrawlerStatusEntity
         );
      }
      return crawlerStatusEntity.eventSeq
         ? crawlerStatusEntity.eventSeq
         : defaultBlocknumber;
   };

   public static updateCrawlerStatus = async (
      blocknumber: number,
      database: DataSource,
      crawlerType: CrawlerType
   ) => {
      const crawlerStatusService: CrawlerStatusService =
         new CrawlerStatusService(database);
      let crawlerStatusEntity: DeepPartial<CrawlerStatusEntity> =
         await crawlerStatusService.getCrawlerStatus(crawlerType);
      crawlerStatusEntity.eventSeq = blocknumber + 1;
      await crawlerStatusService.updateCrawlerStatus(
         crawlerStatusEntity,
         crawlerType
      );
   };

   public static handleEvents = (
      event: any,
      dataSource: DataSource,
      crawlerType: CrawlerType
   ) => {
      const eventHandler: EventHandler = new EventHandler(dataSource);
      switch (crawlerType) {
         case CrawlerType.REGISTRY: {
            switch (event.keys[0]) {
               case RegistryEvent.ACCOUNT_CREATED: {
                  eventHandler.handleRegistryCreateAccount(event);
               }
            }
         }
         case CrawlerType.NFT721: {
            switch (event.keys[0]) {
               case Nft721Event.NFT_MINTED: {
                  eventHandler.handleNFTMinted(event);
               }
            }
         }
      }
   };
}
