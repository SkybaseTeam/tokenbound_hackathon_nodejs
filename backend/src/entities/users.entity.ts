import {
   Entity,
   Column,
   OneToMany,
   BaseEntity,
} from "typeorm";
import { NftEntity } from "./nft.entity";
import { CustomBaseEntity } from "./base.entity";
import { IsDefined, MinLength } from "class-validator";

@Entity({ name: "users" })
export class UsersEntity extends CustomBaseEntity {
   @Column({ nullable: false })
   @IsDefined()
   @MinLength(10)
   address!: string;

   @OneToMany(() => NftEntity, (nft) => nft.user)
   nfts!: NftEntity[];

   constructor(partial?: Partial<UsersEntity>) {
      super();
      Object.assign(this, partial);
   }
}
