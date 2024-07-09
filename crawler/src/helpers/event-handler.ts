import { DataSource } from "typeorm";
import { DataDecoder } from "./data-decoder";
// import Databases from "../services/database.service";
import axios from "axios";
import { NftService } from "../services/nft.service";

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
      const nftService: NftService = new NftService(this.database);
      nftService.createNft({
         tokenId: tokenId,
         name: nftMetadata.name,
         user: userAddress,
         image: nftMetadata.image,
      });
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
