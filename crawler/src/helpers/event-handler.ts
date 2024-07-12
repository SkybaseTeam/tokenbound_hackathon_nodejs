import { DataSource } from "typeorm";
import { DataDecoder } from "./data-decoder";
// import Databases from "../services/database.service";
import axios from "axios";
import { TokenboundService } from "../services/tokenbound.service";
import { TokenboundEntity } from "../entities/tokenbound.entity";
import { TokenboundAccountConnection } from "./tokenbound-account-connection";
// import { TokenboundEntity } from "../entities/tokenbound.entity";

export class EventHandler {
   private readonly database: DataSource;

   constructor(database: DataSource) {
      this.database = database;
   }

   public handleNFTMinted = async (event: any) => {
      const userAddress = event.data[1];
      const tokenId = DataDecoder.feltToInt({
         low: event.data[2],
         high: event.data[3],
      });
      const { data: nftMetadata } = await axios.get(
         `https://grow-api.memeland.com/token/metadata/${tokenId}.json`
      );

      const tokenboundService: TokenboundService = new TokenboundService(
         this.database
      );
      const tokenboundDuplicated =
         await tokenboundService.getTokenboundEntityByTokenId(tokenId);
      if (tokenboundDuplicated) throw new Error("Tokenbound already created");
      await tokenboundService.createNewTokenboundEntity({
         tokenId: tokenId,
         walletAddress: userAddress,
         name: nftMetadata.name,
         image: nftMetadata.image,
      });
      // newTokenbound.collection
      // nftService.createNft({
      //    tokenId: tokenId,
      //    name: nftMetadata.name,
      //    user: userAddress,
      //    image: nftMetadata.image,
      // });
   };

   public handleRegistryCreateAccount = async (event: any) => {
      const tokenId = DataDecoder.feltToInt({
         low: event.data[1],
         high: event.data[2],
      });
      const tokenContractAddress = event.data[0];

      const tokenboundService: TokenboundService = new TokenboundService(
         this.database
      );

      const tokenboundAccount : TokenboundAccountConnection = new TokenboundAccountConnection(tokenContractAddress, tokenId);
      await tokenboundAccount.init();
      const tokenboundAddress : string = await tokenboundAccount.getTokenboundAddress();


      const tokenbound: TokenboundEntity | null =
         await tokenboundService.getTokenboundEntityByTokenId(tokenId);
      if (!tokenbound) {
         throw new Error("Cannot find tokenbound to modify");
      }
      tokenbound.tokenboundAddress = tokenboundAddress;
      // tokenbound.tokenContractAddress = event.data[0];
      return await tokenboundService.updateEntityById(
         tokenbound.id,
         tokenbound
      );
   };

   // static async handleListedEvent(
   //    { event }: any,
   //    database: DataSource
   // ): Promise<any> {
   //    const tokenID = DataDecoder.feltToInt({
   //       low: event.data[2],
   //       high: event.data[3],
   //    });
   //    const price = DataDecoder.feltToInt({
   //       low: event.data[4],
   //       high: event.data[5],
   //    });
   //    await Databases.listingNFT(
   //       {
   //          tokenID,
   //          price,
   //       },
   //       database
   //    );
   // }

   // static async handleCancelEvent({ event }: any): Promise<any> {
   //    const tokenID = DataDecoder.feltToInt({
   //       low: event.data[0],
   //       high: event.data[1],
   //    });
   //    await Databases.changeNFTStatus({
   //       tokenID,
   //       listing: false,
   //    });
   // }

   // static async handleBoughtEvent({ event }: any): Promise<any> {

   // }

   // static async handleEditPriceEvent({ event }: any): Promise<any> {
   //    const tokenID = DataDecoder.feltToInt({
   //       low: event.data[0],
   //       high: event.data[1],
   //    });
   //    const price = DataDecoder.feltToInt({
   //       low: event.data[2],
   //       high: event.data[3],
   //    });
   //    await Databases.changeNFTPrice({
   //       tokenID,
   //       price,
   //    });
   // }

   // static async handleNFTMintedEvent({ event }: any): Promise<any> {
   //    const ownerAddress = event.data[1];
   //    const tokenID = DataDecoder.feltToInt({
   //       low: event.data[2],
   //       high: event.data[3],
   //    });

   //    const owner = await Databases.saveOwner({ address: ownerAddress });
   //    const collection = await Databases.getCollection({
   //       address: process.env.NFT_CONTRACT,
   //    });
   //    const { data: nftMetadata } = await axios.get(
   //       `https://grow-api.memeland.com/token/metadata/${tokenID}.json`
   //    );
   //    await Databases.saveNFT({
   //       tokenID,
   //       name: nftMetadata.name,
   //       owner: owner._id,
   //       NFT_collection: collection._id,
   //       image: nftMetadata.image,
   //    });
   // }
}
