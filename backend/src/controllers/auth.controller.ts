import { Body, Controller, Post, UnauthorizedError } from "routing-controllers";
import { UsersService } from "../services";
import { Service } from "typedi";
import { LoginRule } from "./request/login.rule";
import { UsersEntity } from "../entities/users.entity";
import { validate, ValidationError } from "class-validator";
import { sign } from "jsonwebtoken";
import { config } from "dotenv";
config();
let { JWT_SECRET } = process.env;

@Controller("/auth")
@Service()
export class AuthController {
   constructor(private readonly usersService: UsersService) {}

   @Post("/login")
   async login(@Body() loginRequest: LoginRule): Promise<any> {
      // const validationResult: Array<ValidationError> = await validate(
      //    loginRequest
      // );
      // if (validationResult.length > 0) throw validationResult;
      const { address } = loginRequest;
      // const partialUserData: Partial<UsersEntity> = {
      //    address: address,
      // };
      try {
         const user = await this.usersService.getByAddress(address);
         if (user) {
            const jwt = sign(
               JSON.parse(JSON.stringify(user)),
               JWT_SECRET || "ssdsfsdfdsfsfsdfsd"
            );
            return { token: jwt };
         } else {
            throw new UnauthorizedError("User not found");
         }
      } catch (error) {
         throw new UnauthorizedError("User not found");
      }                                                                       
   }

   @Post("/register")
   async register(@Body() loginRequest: LoginRule): Promise<any> {
      const { address } = loginRequest;
      try {
         let user = await this.usersService.getByAddress(address);
         if (!user) {
            user = new UsersEntity({ address: address });
            await this.usersService.create(user);
         }
         const jwt = sign(
            JSON.parse(JSON.stringify(user)),
            JWT_SECRET || "ssdsfsdfdsfsfsdfsd"
         );
         return { token: jwt };
      } catch (error) {
         throw new UnauthorizedError("User not found");
      }
   }
}
