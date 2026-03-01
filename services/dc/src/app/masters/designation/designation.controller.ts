import { Controller, Post } from "@nestjs/common";
import { DesignationService } from "./designation.service";
import { ApiTags } from "@nestjs/swagger";

@Controller('designation')
@ApiTags('designation')

export class DesignationController {
  constructor(private readonly service: DesignationService) { }

  @Post('getAllDesignations')
  async getAllDesignations(): Promise<any> {
    try {
      return await this.service.getAllDesignations();
    } catch (error) {
      return (error);
    }
  }
}