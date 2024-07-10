import { TokenboundClient } from '@tokenbound/sdk'


class TokenboundAccountConnection {
   private tokenContractAddress : string;
   private tokenId : number;

   constructor(tokenContractAddress : string, tokenId : number){
      this.tokenContractAddress = tokenContractAddress;
      this.tokenId = tokenId;
   }
}