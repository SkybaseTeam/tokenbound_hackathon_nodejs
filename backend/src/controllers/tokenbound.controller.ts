import {
   Body,
   Controller,
   Post,
   HttpError,
   Get,
   Param,
   QueryParam,
} from "routing-controllers";
import { TokenboundEntity } from "../entities/tokenbound.entity";
import { TokenboundService } from "../services";
import { Service } from "typedi";
import { DeepPartial } from "typeorm";
import { StatusCodes } from "http-status-codes";
// import { CollectionService } from "../services/collection.service";
import { Pagination } from "../dtos/response/pagination";

@Controller("/tokenbound")
@Service()
export class TokenboundController {
   constructor(private readonly tokenboundService: TokenboundService) {}

   @Post("/")
   async post(@Body() tokenbound: DeepPartial<TokenboundEntity>) {
      let newTokenbound = await this.tokenboundService.create(tokenbound);
      if (newTokenbound) {
         return newTokenbound;
      }
      throw new HttpError(
         StatusCodes.INTERNAL_SERVER_ERROR,
         "Tokenbound creation failed"
      );
   }

   @Get("/profile/:walletAddress")
   async getProfile(@Param("walletAddress") walletAddress: string) {
      let profile =
         await this.tokenboundService.getByWalletAddress(walletAddress);
      if (profile) {
         return profile;
      }
      throw new HttpError(
         StatusCodes.INTERNAL_SERVER_ERROR,
         "Profile getting failed"
      );
   }

   @Get("/get-point/:tokenboundAddress")
   async getPoint(@Param("tokenboundAddress") tokenboundAddress: string) {
      let tokenboundAccount: TokenboundEntity | null =
         await this.tokenboundService.getByTokenboundAddress(tokenboundAddress);
      if (tokenboundAccount) {
         return tokenboundAccount.point;
      }
      throw new HttpError(
         StatusCodes.INTERNAL_SERVER_ERROR,
         "Point getting failed"
      );
   }

   @Post("/increase-point")
   async increasePoint(
      @Body() { tokenboundAddress }: { tokenboundAddress: string }
   ) {
      try {
         let tokenboundAccount: TokenboundEntity | null =
            await this.tokenboundService.getByTokenboundAddress(
               tokenboundAddress
            );
         if (!tokenboundAccount) {
            throw new HttpError(
               StatusCodes.INTERNAL_SERVER_ERROR,
               "Tokenbound getting failed"
            );
         }
         tokenboundAccount.point = tokenboundAccount.point + 1;
         return await this.tokenboundService.save(tokenboundAccount);
      } catch (error) {
         throw new HttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Point getting failed"
         );
      }
   }

   @Get("/listed")
   async getListedTokenboundAccount() {
      try {
         return await this.tokenboundService.getListedTokenboundAccounts();
      } catch (error) {
         throw new HttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Profile getting failed"
         );
      }
   }

   @Get("/search")
   async searchTokenboundAccounts(
      @QueryParam("name") name: string,
      @QueryParam("pageSize") pageSize: number,
      @QueryParam("pageNumber") pageNumber: number
   ) {
      try {
         if (!Number(pageNumber)) pageNumber = 1;
         else if (Number(pageNumber) < 1) pageNumber = 1;
         if (!Number(pageSize)) pageSize = 16;
         else if (Number(pageSize) < 1) pageNumber = 16;

         const allTokenBoundAccounts =
            await this.tokenboundService.search(name);
         const tokenBoundAccounts = allTokenBoundAccounts.slice(
            (pageNumber - 1) * pageSize,
            pageNumber * pageSize 
         );
         const pageTotal = Math.ceil(allTokenBoundAccounts.length / pageSize);
         const pagination: Pagination<TokenboundEntity> = new Pagination(
            pageNumber,
            pageTotal,
            pageSize,
            tokenBoundAccounts
         );
         return pagination;
      } catch (error) {
         throw new HttpError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Profile getting failed"
         );
      }
   }
}
