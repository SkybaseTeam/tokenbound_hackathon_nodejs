// import Koa from "koa";
// import { DefaultState, DefaultContext } from "koa";
import "colors";
// import Router from "koa-router";
import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { UsersEntity } from "./users.entity";
import { CrawlerStatusEntity } from "./crawler-status.entity";
import { JobManagerEntity } from "./job-manager.entity";
import { CollectionEntity } from "./collection.entity";
import { NftEntity } from "./nft.entity";
import { TokenboundEntity } from './tokenbound.entity';

config();

const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } =
   process.env;
console.log(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME);

const dataSourceOptions: DataSourceOptions = {
   type: "postgres",
   host: DATABASE_HOST,
   username: DATABASE_USER,
   password: DATABASE_PASSWORD,
   database: DATABASE_NAME,
   synchronize: true,
   logging: true,
   entities: [UsersEntity, JobManagerEntity, CrawlerStatusEntity,CollectionEntity, NftEntity, TokenboundEntity],
};

export const connectWithDatabase = async (
   
): Promise<DataSource> => {
   try {
      const dataSource: DataSource = new DataSource(dataSourceOptions);
      (await dataSource.initialize())
         .synchronize(true)
         .then(() => {
            console.log("Synchronized data source".green.bold);
         })
         .catch(() => {
            console.log("Failed to sync data source".red.bold);
         });
      return dataSource;
   } catch (error: any) {
      console.error("Error connecting to the database:", error.message);
      throw error; // Rethrow the error to handle it further up the call stack
   }
};
