import { DataSource } from "typeorm";
import { BaseService } from "./base.service";
import { TokenboundEntity } from "../entities/tokenbound.entity";

export class TokenboundService extends BaseService<TokenboundEntity> {
   private readonly database: DataSource;
   constructor(database: DataSource) {
      super(database, TokenboundEntity);
      this.database = database;
   }

   async getTokenboundEntityByTokenId(tokenId: number): Promise<TokenboundEntity | null> {
      return await this.database.getRepository(TokenboundEntity).findOne({where : {tokenId: tokenId}});
   }
}
