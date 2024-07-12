import { CustomBaseEntity } from "../../entities/base.entity";

export class Pagination<T extends CustomBaseEntity> {
   private pageNumber: number;
   private pageTotal: number;
   private pageSize: number;

   private data: T[];

   constructor(
      pageNumber: number,
      pageTotal: number,
      pageSize: number,
      data: T[]
   ) {
      this.pageNumber = pageNumber;
      this.pageTotal = pageTotal;
      this.pageSize = pageSize;
      this.data = data;
   }

   public getPageNumber(): number {
      return this.pageNumber;
   }

   public getPageTotal(): number {
      return this.pageTotal;
   }

   public getPageSize(): number {
      return this.pageSize;
   }

   public getData(): T[] {
      return this.data;
   }
}
