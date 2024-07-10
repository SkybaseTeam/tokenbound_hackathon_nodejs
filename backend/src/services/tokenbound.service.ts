import { DataSource } from "typeorm";
import { TokenboundEntity } from "../entities/tokenbound.entity";
import { BaseService } from "./base.service";
import { Service } from "typedi";

@Service()
export class TokenboundService extends BaseService<TokenboundEntity> {
   constructor(database: DataSource) {
      super(database.getRepository(TokenboundEntity));
   }
}
