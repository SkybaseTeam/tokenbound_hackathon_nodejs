import { DeepPartial } from "typeorm";
import {
   Controller,
   Param,
   Body,
   Get,
   Post,
   Delete,
   Patch,
   Authorized,
   Ctx,
   CurrentUser,
} from "routing-controllers";
// import { CTX } from "src/interfaces/CTX.interface";
import { Service } from "typedi";
import { UsersEntity } from "./../entities/users.entity";
import { UsersService } from "./../services";
import { CTX } from "src/interfaces";
// import { validate, ValidationError } from "class-validator";

@Controller("/users")
@Service()
export class UserController {
   constructor(private readonly usersService: UsersService) {}

   @Get("/profile")
   async getAll(
      @Ctx() ctx: CTX,
      @CurrentUser() user: DeepPartial<UsersEntity>
   ) {
      console.log(user);
      return await this.usersService.getAllData();
   }

}
