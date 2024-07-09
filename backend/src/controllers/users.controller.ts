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

   @Get("/")
   @Authorized()
   async getAll(
      @Ctx() ctx: CTX,
      @CurrentUser() user: DeepPartial<UsersEntity>
   ) {
      console.log(user);
      return await this.usersService.getAllData();
   }

   @Get("/:id")
   @Authorized()
   async getOne(@Param("id") id: number) {
      return await this.usersService.getById(id);
   }

   @Post("/")
   async post(@Body() user: DeepPartial<UsersEntity>) {
      // const instance: DeepPartial<UsersEntity> =
      //    this.usersService.getInstance(user);
      // const validationResult: Array<ValidationError> = await validate(instance);
      // console.log(validationResult);
      // if (validationResult.length > 0) throw validationResult;
      return await this.usersService.create(user);
   }

   @Patch("/:id")
   async patch(
      @Param("id") id: number,
      @Body() user: DeepPartial<UsersEntity>
   ) {
      return await this.usersService.update(id, user);
   }

   @Delete("/:id")
   async remove(@Param("id") id: number) {
      return await this.usersService.delete(id);
   }
}
