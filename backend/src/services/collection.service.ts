import { DataSource } from "typeorm";
import { BaseService } from "./base.service";
import { Service } from "typedi";
import { CollectionEntity } from "../entities/collection.entity";

@Service()
export class CollectionService extends BaseService<CollectionEntity> {
   constructor(database: DataSource) {
      super(database.getRepository(CollectionEntity));
   }
}
