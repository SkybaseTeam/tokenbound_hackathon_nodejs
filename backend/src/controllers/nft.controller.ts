import {
   Body,
   Controller,
   Post,
   HttpError,
   Get,
   Param,
} from "routing-controllers";
import { TokenboundEntity } from "../entities/tokenbound.entity";
import { NftService, TokenboundService } from "../services";
import { Service } from "typedi";
import { DeepPartial } from "typeorm";
import { StatusCodes } from "http-status-codes";
import { NftEntity } from '../entities/nft.entity';

@Controller("/nft")
@Service()
export class NftController{
   constructor(private readonly nftService: NftService) {}

   @Get("/listed")
   async getListedTokenboundAccount() {
      try {
         return await this.nftService.getListedNfts();
      } catch (error) {
         throw new HttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Profile getting failed"
         );
      }
   }
  

}