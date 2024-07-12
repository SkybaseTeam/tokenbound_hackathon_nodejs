import { TokenboundClient, WalletClient, Call } from "starknet-tokenbound-sdk";
import { useAccount } from "@starknet-react/core";

class TokenboundAccountConnection {
   private tokenContractAddress: string;
   private tokenId: number;
   private walletAddress: string;
   private privateKey: string;
   private tokenbound: TokenboundClient;

   private readonly salt = "1000";

   constructor(
      walletAddress: string,
      tokenContractAddress: string,
      tokenId: number
   ) {
      this.walletAddress = walletAddress;
      this.tokenContractAddress = tokenContractAddress;
      this.tokenId = tokenId;

      this.connectWithWalletClient();
   }

   private async connectWithWalletClient() {
      const walletClient: WalletClient = {
         address: this.walletAddress,
         privateKey: "",
      };
      const options = {
         walletClient: walletClient,
         registryAddress: this.tokenContractAddress,
         implementationAddress: "",
         jsonRPC: `https://starknet-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
      };
      const tokenbound = new TokenboundClient(options);
      this.tokenbound = tokenbound;
   }

   public async getTokenboundAddress(): Promise<string> {
      const account = await this.tokenbound.getAccount({
         tokenContract: this.tokenContractAddress,
         tokenId: this.tokenId.toString(),
         salt: this.salt,
      });

      return account.toString();
   }

   public async getTokenboundOwner(tokenAboutAddress: string) {
      const nftOwner = await this.tokenbound.getOwner({
         tokenContract: this.tokenContractAddress,
         tokenId: this.tokenId.toString(),
         tbaAddress: tokenAboutAddress,
      });
      return nftOwner.toString();
   }
}
