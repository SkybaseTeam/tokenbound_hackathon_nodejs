import { DataSource } from "typeorm";
import { TokenboundEntity } from "../entities/tokenbound.entity";
import { BaseService } from "./base.service";
import { Service } from "typedi";

@Service()
export class TokenboundService extends BaseService<TokenboundEntity> {
   constructor(database: DataSource) {
      super(database.getRepository(TokenboundEntity));
   }

   async getByWalletAddress(address: string): Promise<TokenboundEntity[]> {
      return await this.repository.find({ where: { walletAddress: address } });
   }
}
