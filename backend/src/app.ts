import Koa from "koa";
import { DefaultState, DefaultContext } from "koa";
import "colors";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
// import Router from "koa-router";
import {
   createKoaServer,
   useContainer,
   Action,
   UnauthorizedError,
} from "routing-controllers";
import { connectWithDatabase } from "./entities";
import {
   AuthController,
   CollectionController,
   NftController,
   TokenboundController,
} from "./controllers";

import { services } from "./services";
import { Container } from "typedi";
import { decode, verify } from "jsonwebtoken";
import validationMiddleware from "./middlewares/validation.middleware";

import { Server } from "socket.io";
import { createServer } from "node:http";
import "reflect-metadata";
import { connectWithSocket } from "./socket";
import { BaseService } from "./services/base.service";
import { DeepPartial } from "typeorm";
import { koaSwagger } from "koa2-swagger-ui";
import serve from "koa-static";
import { TokenboundEntity } from "./entities/tokenbound.entity";
import { Config } from "./config";

const startApp = async () => {
   const config: Config = new Config();
   const dataSource = await connectWithDatabase();
   const app: Koa<DefaultState, DefaultContext> = createKoaServer({
      controllers: [
         AuthController,
         CollectionController,
         TokenboundController,
         NftController,
      ],
      async authorizationChecker(action: Action): Promise<boolean> {
         try {
            const token = getJWT(action.request.headers);
            if (!verify(token, config.JWT_SECRET))
               throw new UnauthorizedError();
            const decoderUser: DeepPartial<TokenboundEntity> =
               await decodeJWT(token);
            const user: DeepPartial<TokenboundEntity> = (await dataSource
               .getRepository(TokenboundEntity)
               .findOne({
                  where: { id: decoderUser.id },
               })) as DeepPartial<TokenboundEntity>;
            console.log(user);
            if (user) {
               action.context.user = user;
               return true;
            } else {
               throw new UnauthorizedError();
            }
         } catch (error) {
            throw new UnauthorizedError();
         }
      },
      async currentUserChecker(action: Action) {
         try {
            const token = getJWT(action.request.headers);
            const decoderUser: DeepPartial<TokenboundEntity> =
               await decodeJWT(token);
            const user: DeepPartial<TokenboundEntity> = (await dataSource
               .getRepository(TokenboundEntity)
               .findOne({
                  where: { id: decoderUser.id },
               })) as DeepPartial<TokenboundEntity>;
            console.log(user);
            if (user) {
               return user;
            } else {
               throw new UnauthorizedError();
            }
         } catch (error) {
            throw new UnauthorizedError();
         }
      },
   });
   // const router: Router = new Router();
   app.context.database = dataSource;
   app.use(bodyParser());
   app.use(
      cors({
         origin: "*",
         credentials: true,
         // allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         // allowHeaders: ["Content-Type", "Authorization"],
      })
   );
   app.use(validationMiddleware);
   //? Set up service
   services.forEach((service) => {
      Container.set(service, new service(app.context.database));
   });
   Container.set(BaseService, new BaseService(app.context.database));
   useContainer(Container);

   //? Set up swagger
   app.use(serve(__dirname + "/swagger.json"));
   app.use(
      koaSwagger({
         routePrefix: "/swagger", // host at /swagger instead of default /docs
         swaggerOptions: {
            url: "/swagger.json", // example path to json
         },
      })
   );
   const server = createServer(app.callback());
   const io = new Server(server, {
      cors: {
         origin: "http://localhost:3000", // React app URL
         methods: ["GET", "POST"],
      },
   });

   connectWithSocket(io);

   server.listen(config.PORT || 5002).on("listening", async () => {
      try {
         // let collection: DeepPartial<CollectionEntity> =
         //    await GetCollection.getCollectionInformation(
         //       StarknetConstants.ERC721_CONTRACT_ADDRESS
         //    );
         // await dataSource.getRepository(CollectionEntity).save(collection);

         console.log(
            `Server started on port ${config.PORT || 5000}, go to http://localhost:${config.PORT || 5000}`
               .blue.bold
         );
      } catch (error) {
         console.error("Error while starting server:", error);
      }
   });
};

const getJWT = ({ authorization }: any) => {
   const [_, token]: string = authorization.split(" ");
   return token;
};

const decodeJWT = async (
   token: string
): Promise<DeepPartial<TokenboundEntity>> => {
   return (await decode(token)) as DeepPartial<TokenboundEntity>;
};

startApp();
