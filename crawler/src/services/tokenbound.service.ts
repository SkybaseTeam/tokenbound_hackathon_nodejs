import { DataSource } from "typeorm";
import { BaseService } from "./base.service";
import { TokenboundEntity } from "../entities/tokenbound.entity";

export class TokenboundService extends BaseService<TokenboundEntity> {
   // private readonly database: DataSource;
   constructor(database: DataSource) {
      super(database, TokenboundEntity);
      // this.database = database;
   }
}
