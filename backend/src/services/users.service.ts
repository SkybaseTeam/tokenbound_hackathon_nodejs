import { UsersEntity } from "../entities/users.entity";
import { Service } from "typedi";
import { DataSource, Repository } from "typeorm";
import { constants, Contract, RpcProvider, typedData } from "starknet";
import { BaseService } from "./base.service";

@Service()
export class UsersService extends BaseService<UsersEntity> {
   constructor(database: DataSource) {
      super(database.getRepository(UsersEntity));
   }

   async getByAddress(address: string) {
      return await this.repository.findOne({ where: { address: address } });
   }

   // async play() {
   //    const provider = new RpcProvider({
   //       nodeUrl: constants.NetworkName.SN_SEPOLIA,
   //    });
   //    const { abi: contractAbi } = await provider.getClassAt("");

   //    if (!contractAbi) {
   //       return false;
   //    }

   //    const accountContract = new Contract(contractAbi, "", provider);
   // }
}
