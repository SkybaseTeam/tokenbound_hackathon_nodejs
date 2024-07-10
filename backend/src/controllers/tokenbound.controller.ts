import { Body, Controller, Post, HttpError } from "routing-controllers";
import { TokenboundEntity } from "../entities/tokenbound.entity";
import { TokenboundService } from "../services";
import { Service } from "typedi";
import { DeepPartial } from "typeorm";
import { StatusCodes } from "http-status-codes";

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
}
