import Koa from "koa";
import { DefaultState, DefaultContext } from "koa";
import "colors";
import bodyParser from "koa-bodyparser";
// import Router from "koa-router";
import {
   createKoaServer,
   useContainer,
   Action,
   UnauthorizedError,
} from "routing-controllers";
import { connectWithDatabase } from "./entities";
import { AuthController, CollectionController, TokenboundController, UserController } from "./controllers";
import { services } from "./services";
import { Container } from "typedi";
import { decode, verify } from "jsonwebtoken";
import validationMiddleware from "./middlewares/validation.middleware";

import { Server } from "socket.io";
import { createServer } from "node:http";
import "reflect-metadata";
import { connectWithSocket } from "./socket";
import { config } from "dotenv";
import { BaseService } from "./services/base.service";
import { DeepPartial } from "typeorm";
import { UsersEntity } from "./entities/users.entity";

config();
let { PORT, JWT_SECRET } = process.env;

const startApp = async () => {
   const dataSource = await connectWithDatabase();
   const app: Koa<DefaultState, DefaultContext> = createKoaServer({
      controllers: [UserController, AuthController, CollectionController, TokenboundController],
      async authorizationChecker(action: Action): Promise<boolean> {
         try {
            const token = getJWT(action.request.headers);
            if (!verify(token, JWT_SECRET || "ssdsfsdfdsfsfsdfsd"))
               throw new UnauthorizedError();
            const decoderUser: DeepPartial<UsersEntity> = await decodeJWT(
               token
            );
            const user: DeepPartial<UsersEntity> = (await dataSource
               .getRepository(UsersEntity)
               .findOne({
                  where: { id: decoderUser.id },
               })) as DeepPartial<UsersEntity>;
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
            const decoderUser: DeepPartial<UsersEntity> = await decodeJWT(
               token
            );
            const user: DeepPartial<UsersEntity> = (await dataSource
               .getRepository(UsersEntity)
               .findOne({
                  where: { id: decoderUser.id },
               })) as DeepPartial<UsersEntity>;
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
   app.use(validationMiddleware);
   // Set up service
   services.forEach((service) => {
      Container.set(service, new service(app.context.database));
   });

   Container.set(BaseService, new BaseService(app.context.database));
   useContainer(Container);

   const server = createServer(app.callback());
   const io = new Server(server, {
      cors: {
         origin: "http://localhost:3000", // React app URL
         methods: ["GET", "POST"],
      },
   });

   connectWithSocket(io);

   server.listen(PORT || 5000).on("listening", () => {
      console.log(
         `Server start on port ${PORT || 5000}, go to http://localhost:${
            PORT || 5000
         }`.blue.bold
      );
   });
};

const getJWT = ({ authorization }: any) => {
   const [_, token]: string = authorization.split(" ");
   return token;
};

const decodeJWT = async (token: string): Promise<DeepPartial<UsersEntity>> => {
   return (await decode(token)) as DeepPartial<UsersEntity>;
};

startApp();
