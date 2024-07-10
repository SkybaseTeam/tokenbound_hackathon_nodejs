import { IsDefined, IsString, MinLength } from "class-validator";

export class LoginRule {
   @IsDefined({ always: true })
   @IsString()
   @MinLength(10)
   address!: string;
}
