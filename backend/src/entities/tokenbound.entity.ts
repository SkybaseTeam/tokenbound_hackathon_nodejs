import { Column, Entity } from "typeorm";
import { CustomBaseEntity } from "./base.entity";

@Entity("tokenbound_account")
export class TokenboundEntity extends CustomBaseEntity {
   @Column({ name: "token_contract_address", type: "text" })
   tokenContractAddress!: string;

   @Column({ name: "token_id", type: "integer" })
   tokenId!: number;

   @Column({type: "integer", default:0})
   point!: number;

   @Column({type: "integer", default:0})
   level!: number;

   @Column({type: "text"})
   name!: string;

   @Column({type: "float", default:0})
   price!: number;

   constructor() {
      super();
   }
}
