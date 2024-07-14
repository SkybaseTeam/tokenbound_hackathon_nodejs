import { DataSource } from "typeorm";
import { TokenboundEntity } from "../entities/tokenbound.entity";
import { BaseService } from "./base.service";
import { Service } from "typedi";
import { ILike } from "typeorm";

@Service()
export class TokenboundService extends BaseService<TokenboundEntity> {
   constructor(database: DataSource) {
      super(database.getRepository(TokenboundEntity));
   }

   async getByWalletAddress(address: string): Promise<TokenboundEntity[]> {
      return await this.repository.find({
         where: { walletAddress: address },
         order: { tokenId: "ASC" },
         relations: ["nfts"],
      });
   }

   async getByTokenId(tokenId: number): Promise<TokenboundEntity | null> {
      return await this.repository.findOne({
         where: { tokenId: tokenId } as any,
      });
   }

   async getByTokenboundAddress(
      address: string
   ): Promise<TokenboundEntity | null> {
      return await this.repository.findOne({
         where: { tokenboundAddress: address },
      });
   }

   async getListedTokenboundAccounts(): Promise<TokenboundEntity[]> {
      return await this.repository.find({
         where: { listing: true },
         relations: ["nfts"],
      });
   }

   async search(name: string): Promise<TokenboundEntity[]> {
      return await this.repository.find({
         where: { listing: true, name: ILike(`%${name}%`) },
         relations: ["nfts"],
         order: { id: "ASC" },
      });
   }
}
