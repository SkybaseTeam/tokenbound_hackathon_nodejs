import { Controller, Get, HttpError } from "routing-controllers";
import { CollectionService } from "../services";
import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import { DeepPartial } from "typeorm";
import { CollectionEntity } from "../entities/collection.entity";
import { GetCollection } from "../helpers/get-collection";
import { StarknetConstants } from "../constants/starknet.constant";

@Controller("/collection")
@Service()
export class CollectionController {
   constructor(private readonly collectionService: CollectionService) {}

   @Get("/")
   // @body((CollectionEntity as any).swaggerDocument)
   async get() {
      try {
         let collections = await this.collectionService.getAllData();
         if (collections.length == 0) {
            let collection: DeepPartial<CollectionEntity> =
               await GetCollection.getCollectionInformation(
                  StarknetConstants.ERC721_CONTRACT_ADDRESS
               );
            let collectionResult =
               await this.collectionService.create(collection);
            return collectionResult;
         }
         return collections[0];
      } catch (error) {
         throw new HttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal error occurred"
         );
      }
   }
}
