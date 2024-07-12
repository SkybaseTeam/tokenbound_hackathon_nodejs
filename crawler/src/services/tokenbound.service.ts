import { DataSource, DeepPartial } from "typeorm";
import { BaseService } from "./base.service";
import { TokenboundEntity } from "../entities/tokenbound.entity";
import { CollectionEntity } from "../entities/collection.entity";

export class TokenboundService extends BaseService<TokenboundEntity> {
   private readonly database: DataSource;
   constructor(database: DataSource) {
      super(database, TokenboundEntity);
      this.database = database;
   }

   async getTokenboundEntityByTokenId(
      tokenId: number
   ): Promise<TokenboundEntity | null> {
      return await this.database
         .getRepository(TokenboundEntity)
         .findOne({ where: { tokenId: tokenId } });
   }

   async createNewTokenboundEntity(
      entity: DeepPartial<TokenboundEntity>
   ): Promise<TokenboundEntity> {
      try {
         const newTokenboundEntity: TokenboundEntity =
            (await this.createNewEntity(entity)) as TokenboundEntity;
         const collection = await this.database
            .getRepository(CollectionEntity)
            .findOne({ where: { id: 1 } });
         if (!collection) throw new Error("Couldn't find collection");
         if (!collection?.tokenboundAccounts) {
            collection.tokenboundAccounts = [];
         }
         collection?.tokenboundAccounts?.push(newTokenboundEntity);
         this.database.getRepository(CollectionEntity).save(collection);
         return newTokenboundEntity;
      } catch (error) {
         throw error;
      }
   }
}
