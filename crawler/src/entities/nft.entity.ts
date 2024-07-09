import {
   Entity,
   Column,
   ManyToOne,
} from "typeorm";
import { CollectionEntity } from "./collection.entity";
import { UsersEntity } from "./users.entity";
import { CustomBaseEntity } from "./base.entity";

@Entity({ name: "nft" })
export class NftEntity extends CustomBaseEntity {
   @Column({ name: "token_id" })
   tokenId!: number;

   @Column({ nullable: false })
   name!: string;

   @Column({ nullable: false })
   image!: string;

   @Column({ nullable: false })
   price!: Number;

   @Column({ nullable: false, default: false })
   listing!: Boolean;

   @Column({ nullable: false, default: () => "CURRENT_TIMESTAMP" })
   timestamp!: Date;

   @ManyToOne(() => CollectionEntity, (collection) => collection.nfts)
   collection!: CollectionEntity;

   @ManyToOne(() => UsersEntity, (user) => user.nfts)
   user!: UsersEntity;

   constructor() {
      super();
   }
}
