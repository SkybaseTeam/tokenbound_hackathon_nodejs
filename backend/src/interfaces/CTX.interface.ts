import { Context } from "koa";
import { DataSource } from "typeorm";

export interface CTX extends Context {
   database: DataSource;
}
