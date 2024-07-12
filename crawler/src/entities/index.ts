import "colors";
// import Router from "koa-router";
import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { CrawlerStatusEntity } from "./crawler-status.entity";
import { JobManagerEntity } from "./job-manager.entity";
import { CollectionEntity } from "./collection.entity";
import { NftEntity } from "./nft.entity";
import { TokenboundEntity } from "./tokenbound.entity";

config();

const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME,DATABASE_PORT } =
   process.env;
console.log(DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME,DATABASE_PORT);

let databaseHost = DATABASE_HOST || "pg-27090a41-bling-blockchain.h.aivencloud.com";
let databaseUser = DATABASE_USER || "avnadmin";
let databasePassword = DATABASE_PASSWORD || "AVNS_5tBInksddd2BSHuiSqx";
let databaseName = DATABASE_NAME || "bling-bling";
let databasePort = Number(DATABASE_PORT) || 19096;

const dataSourceOptions: DataSourceOptions = {
   type: "postgres",
   host: databaseHost,
   username: databaseUser,
   password: databasePassword,
   database: databaseName,
   synchronize: false,
   logging: true,
   port : databasePort,
   ssl: {
      rejectUnauthorized: false, // Disables SSL certificate verification
   },
   entities: [
      JobManagerEntity,
      CrawlerStatusEntity,
      CollectionEntity,
      NftEntity,
      TokenboundEntity
   ],
};

export const connectWithDatabase = async (): Promise<DataSource> => {
   try {
      const dataSource: DataSource = new DataSource(dataSourceOptions);
      (await dataSource.initialize())
         .synchronize(false)
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
