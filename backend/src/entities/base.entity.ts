import { IsEmpty } from "class-validator";
import { Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: "collection" })
export class CustomBaseEntity {
   @PrimaryGeneratedColumn()
   @IsEmpty({always : true, message : "Do not send the ID"})
   id!: number;
}
