import { IsDecimal, IsDefined, IsString, MinLength } from "class-validator";

export class LoginRule {
   @IsDefined({ always: true })
   @IsString()
   @MinLength(10)
   walletAddress: string;

   @IsDefined({ always: true })
   @IsString()
   @MinLength(10)
   tokenboundAddress: string;

   @IsDefined({ always: true })
   @IsString()
   @MinLength(10)
   tokenContractAddress: string;

   @IsDefined({ always: true })
   @IsDecimal()
   tokenId : number;



   @IsDefined({ always: true })
   signature: any;

   @IsDefined({ always: true })
   signData: any;
}
