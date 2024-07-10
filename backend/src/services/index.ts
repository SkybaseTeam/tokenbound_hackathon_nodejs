export { UsersService } from "./users.service";
export {TokenboundService} from "./tokenbound.service";
export {CollectionService}

import { UsersService } from "./users.service";
import { TokenboundService } from './tokenbound.service';
import { CollectionService } from './collection.service';

export const services = [UsersService, TokenboundService, CollectionService];
