import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { VendorEntity } from "./entity/vendor.entity";

@Injectable()
export class VendorService {

    constructor(
        @InjectRepository(VendorEntity)
        private repository: Repository<VendorEntity>,
      ) { }

      async getAllVendors(): Promise<any> {
        const data = await this.repository.find();
        if (data.length === 0) {
          console.log('oooo')
        }
        return data
      }
}