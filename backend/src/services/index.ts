export { TokenboundService } from "./tokenbound.service";
export { CollectionService } from "./collection.service";
export { NftService } from "./nft.service";

import { TokenboundService } from "./tokenbound.service";
import { CollectionService } from "./collection.service";
import { NftService } from "./nft.service";

export const services = [TokenboundService, CollectionService, NftService];
