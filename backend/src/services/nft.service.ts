import { DataSource } from "typeorm";
import { BaseService } from "./base.service";
import { Service } from "typedi";
import { NftEntity } from "../entities/nft.entity";

@Service()
export class NftService extends BaseService<NftEntity> {
   constructor(database: DataSource) {
      super(database.getRepository(NftEntity));
   }

   async getListedNfts():Promise<NftEntity[]>{
      return await this.repository.find({ where: { listing: true } });
   }
}
