import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NftEntity } from "./nft.entity";
import { CustomBaseEntity } from "./base.entity";

@Entity({ name: "collection" })
export class CollectionEntity extends CustomBaseEntity{
   @PrimaryGeneratedColumn()
   id!: number;

   @Column({ nullable: false, unique: true })
   address!: string;

   @Column({ nullable: false })
   name!: string;

   @Column({ nullable: false })
   symbol!: string;

   @Column({ nullable: false, name: "mint_price" })
   mintPrice!: number;

   @OneToMany(() => NftEntity, (nft) => nft.collection)
   nfts!: NftEntity[];

   constructor(partial?: Partial<CollectionEntity>) {
      super();
      Object.assign(this, partial);
   }
}
