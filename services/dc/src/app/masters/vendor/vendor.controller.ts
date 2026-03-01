import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { VendorService } from "./vendor.service";

@Controller('vendor')
@ApiTags('vendor')

export class VendorController {
  constructor(private readonly service: VendorService) { }

  @Post('getAllVendors')
  async getAllVendors(): Promise<any> {
    try {
      return await this.service.getAllVendors();
    } catch (error) {
      return (error);
    }
  }
}