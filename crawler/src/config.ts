import { config } from "dotenv";

config();

export class Config {
   public DATABASE_HOST: string;
   public DATABASE_USER: string;
   public DATABASE_PASSWORD: string;
   public DATABASE_NAME: string;
   public DATABASE_PORT: number;
   public JWT_SECRET: string;
   public NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS: string;
   public PORT: number;

   public NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS: string;
   public NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS: string;
   public NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS: string;
   public NEXT_PUBLIC_ACCOUNT_CLASS_HASH: string;

   constructor() {
      this.DATABASE_HOST =
         process.env.DATABASE_HOST ||
         "localhost";
      this.DATABASE_USER = process.env.DATABASE_USER || "postgres";
      this.DATABASE_PASSWORD =
         process.env.DATABASE_PASSWORD || "Phongsql123";
      this.DATABASE_NAME = process.env.DATABASE_NAME || "ventorii-nft";
      this.DATABASE_PORT = Number(process.env.DATABASE_PORT) || 5432;
      this.PORT = Number(process.env.PORT) || 5000;
      this.JWT_SECRET =
         process.env.JWT_SECRET || "dijgnidfgidgojdngkdsfjnfkdjsngkjenf";

      // this.DATABASE_HOST =
      //    process.env.DATABASE_HOST ||
      //    "pg-27090a41-bling-blockchain.h.aivencloud.com";
      // this.DATABASE_USER = process.env.DATABASE_USER || "avnadmin";
      // this.DATABASE_PASSWORD =
      //    process.env.DATABASE_PASSWORD || "AVNS_5tBInksddd2BSHuiSqx";
      // this.DATABASE_NAME = process.env.DATABASE_NAME || "bling-bling";
      // this.DATABASE_PORT = Number(process.env.DATABASE_PORT) || 19096;
      // this.PORT = Number(process.env.PORT) || 5000;
      // this.JWT_SECRET =
      //    process.env.JWT_SECRET || "dijgnidfgidgojdngkdsfjnfkdjsngkjenf";

      this.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS =
         process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS ||
         "0x002825f54382afee98d6cfe8f2daf9aae24089b4a724de92b0e4fda50a4551e9";
      this.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS =
         process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS ||
         "0x04fbc43ca36833a382c1e2f5d1d4bb82c84abe8a78f69eea0986f6994b7cbf62";
      this.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS =
         process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS ||
         "0x06a1dab752f228256242e78bc6bc5ed1f403c68fcf8a223dc192782f7dc03f54";
      this.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS =
         process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS ||
         "0x03abac757880b8b343e30e14f83981a6b949580f213edec72feb41757c950d36";
      this.NEXT_PUBLIC_ACCOUNT_CLASS_HASH =
         process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH ||
         "0x044a1e8271aa670a54b6b54fd1c20083e8ac310bfe1e319c418b87930a2357a5";
   }
}
