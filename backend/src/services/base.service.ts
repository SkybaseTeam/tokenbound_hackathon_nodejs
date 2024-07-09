import { Repository, DeepPartial, UpdateResult, DeleteResult } from "typeorm";
import { CustomBaseEntity } from "../entities/base.entity";

export class BaseService<T extends CustomBaseEntity> {
   readonly repository: Repository<T>;

   constructor(repository: Repository<T>) {
      this.repository = repository;
   }

   async getAllData(): Promise<Array<Partial<T>>> {
      return await this.repository.find();
   }

   async getById(id: number): Promise<Partial<T> | null> {
      return await this.repository.findOne(id as any);
   }

   async create(data: DeepPartial<T>) {
      const newEntity: DeepPartial<T> = await this.repository.create(data);
      return await this.repository.save(newEntity);
   }

   async update(id: number, body: DeepPartial<T>): Promise<Partial<T> | null> {
      const updateResult: UpdateResult = await this.repository.update(
         id,
         body as any
      );
      if (updateResult.affected && updateResult.affected > 0) {
         const updatedEntity = await this.repository.findOne(id as any);
         return updatedEntity ? updatedEntity : null;
      }
      return null;
   }

   async delete(id: number): Promise<Partial<T> | null> {
      const deleteResult: DeleteResult = await this.repository.delete(
         id as any
      );
      if (deleteResult.affected && deleteResult.affected > 0) {
         const deletedEntity = await this.repository.findOne(id as any);
         return deletedEntity ? deletedEntity : null;
      }
      return null;
   }

   // getInstance(data: DeepPartial<T>): DeepPartial<T> {
   //    return this.repository.create(data);
   // }
}
