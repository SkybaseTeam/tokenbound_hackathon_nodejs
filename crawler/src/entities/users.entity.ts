import {
   Entity,
   Column,
   OneToMany,
} from "typeorm";
import { NftEntity } from "./nft.entity";
import { CustomBaseEntity } from "./base.entity";

@Entity({ name: "users" })
export class UsersEntity extends CustomBaseEntity {
   @Column({ nullable: false })
   address!: string;

   @OneToMany(() => NftEntity, (nft) => nft.user)
   nfts!: NftEntity[];

   constructor(partial?: Partial<UsersEntity>) {
      super();
      Object.assign(this, partial);
   }
}
