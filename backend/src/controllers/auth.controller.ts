import { Body, Controller, Post, UnauthorizedError } from "routing-controllers";
import { Service } from "typedi";
import { LoginRule } from "../dtos/request/login.rule";
import { sign } from "jsonwebtoken";
import { config } from "dotenv";
import { TokenboundService } from "../services";
import { TokenboundEntity } from "../entities/tokenbound.entity";
import { SignatureVerification } from "../helpers/signature-verification";
import { TokenboundAccountConnection } from "../helpers/tokenbound-account-connection";
config();
let { JWT_SECRET } = process.env;

@Controller("/auth")
@Service()
export class AuthController {
   constructor(private readonly tokenboundService: TokenboundService) {}

   @Post("/login")
   async login(@Body() loginRequest: LoginRule): Promise<any> {
      const {
         walletAddress,
         tokenboundAddress,
         tokenContractAddress,
         tokenId,
         signature,
         signData,
      } = loginRequest;
      console.log(walletAddress, tokenboundAddress);
      try {
         //? Verify the signature
         const isVerified: boolean =
            await SignatureVerification.verifySignatureStarknet({
               walletAddress,
               signature,
               signData,
            } as any);
         if (!isVerified) {
            throw new UnauthorizedError("Can not verify signature");
         }

         //? Verify the TokenboundAddress
         const tokenboundAccount: TokenboundAccountConnection =
            new TokenboundAccountConnection(tokenContractAddress, tokenId);
         await tokenboundAccount.init();
         const nftOwner =
             await tokenboundAccount.getTokenboundOwner(tokenboundAddress);
         if (!nftOwner) {
            throw new UnauthorizedError("Can not get owner");
         }

         const user: TokenboundEntity[] =
            await this.tokenboundService.getByWalletAddress(walletAddress);
         // console.log(user);
         if (user.length > 0) {
            const jwt = sign(
               JSON.parse(
                  JSON.stringify({
                     walletAddress: user[0].walletAddress,
                     owner: nftOwner,
                  })
               ),
               JWT_SECRET || "ssdsfsdfdsfsfsdfsd"
            );
            console.log(jwt);
            return { token: jwt };
         } else {
            throw new UnauthorizedError("User not found");
         }
      } catch (error) {
         throw new UnauthorizedError("User not found");
      }
   }

   // @Post("/register")
   // async register(@Body() loginRequest: LoginRule): Promise<any> {
   //    const { address } = loginRequest;
   //    try {
   //       let user = await this.usersService.getByAddress(address);
   //       if (!user) {
   //          user = new UsersEntity({ address: address });
   //          await this.usersService.create(user);
   //       }
   //       const jwt = sign(
   //          JSON.parse(JSON.stringify(user)),
   //          JWT_SECRET || "ssdsfsdfdsfsfsdfsd"
   //       );
   //       return { token: jwt };
   //    } catch (error) {
   //       throw new UnauthorizedError("User not found");
   //    }
   // }
}
