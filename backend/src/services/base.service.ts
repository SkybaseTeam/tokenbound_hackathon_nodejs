import { Repository, DeepPartial, UpdateResult, DeleteResult } from "typeorm";
import { CustomBaseEntity } from "../entities/base.entity";

export class BaseService<T extends CustomBaseEntity> {
   readonly repository: Repository<T>;

   constructor(repository: Repository<T>) {
      this.repository = repository;
   }

   async getAllData(): Promise<Array<Partial<T>>> {
      try {
         return await this.repository.find();
      } catch (error) {
         return [];
      }
   }

   async getById(id: number): Promise<Partial<T> | null> {
      try {
         return await this.repository.findOne(id as any);
      } catch (error) {
         return null;
      }
   }

   async create(data: DeepPartial<T>) {
      try {
         const newEntity: DeepPartial<T> = this.repository.create(data);
         return await this.repository.save(newEntity);
      } catch (error) {
         return null;
      }
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

   async save(body: DeepPartial<T>): Promise<T> {
      const result = await this.repository.save(body);
      return result;
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
