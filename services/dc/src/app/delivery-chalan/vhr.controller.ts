import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { VRRefIdsResponseModel } from "libs/shared-models";
import { CommonRequestAttrs, CommonResponse } from "libs/shared-models/src/common";
import { RefIdStatusDTO } from "./dto/ref-id-status-dto";
import { TruckIdReqeust } from "./dto/truck-id-dto";
import { VehicleINRDto } from "./dto/vehicle-inr-dto";
import { VehicleOTRDto } from "./dto/vehicle-out.dto";
import { VRStatusDTO } from "./dto/vr-status-req.dto";
import { VHRService } from "./vhr.service";

@ApiTags('Vehicle Request')
@Controller("vhr")
export class VHRController {
  applicationExceptionHandler: any;
  constructor(
    private readonly vhrService: VHRService,
  ) { }

  @Post('/createVINR')
  @ApiBody({ type: [VehicleINRDto] })
  async createVINR(@Body() req: any[]): Promise<CommonResponse> {
    try {
      return await this.vhrService.createVINR(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/createVOTR')
  @ApiBody({ type: [VehicleOTRDto] })
  async createVOTR(@Body() req: any[]): Promise<CommonResponse> {
    try {
      return await this.vhrService.createVOTR(req);
    } catch (error) {
      return (error);
    }

  }

  @Post('/getVINR')
  @ApiBody({ type: [RefIdStatusDTO] })
  async getVINR(@Body() req: any[]): Promise<CommonResponse> {
    try {
      return await this.vhrService.getVINR(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/getVOTR')
  @ApiBody({ type: [RefIdStatusDTO] })
  async getVOTR(@Body() req: any[]): Promise<CommonResponse> {
    try {
      return await this.vhrService.getVOTR(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/getTruckInfoByTruckId')
  @ApiBody({ type: TruckIdReqeust })
  async getTruckInfoByTruckId(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.getTruckInfoByTruckId(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/updateTruckState')
  @ApiBody({ type: TruckIdReqeust })
  async updateTruckState(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.updateTruckState(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/getVehicleRecordForReferenceId')
  @ApiBody({ type: RefIdStatusDTO })
  async getVehicleRecordForReferenceId(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.getVehicleRecordForReferenceId(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/getRefIdsByStatus')
  @ApiBody({ type: VRStatusDTO })
  async getRefIdsByStatus(@Body() req: any): Promise<VRRefIdsResponseModel> {
    try {
      return await this.vhrService.getRefIdsByStatus(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(VRRefIdsResponseModel, error);
    }
  }

  @Post('/getVehicleNotAssignedVINRRequestIds')
  @ApiBody({ type: CommonRequestAttrs })
  async getVehicleNotAssignedVINRRequestIds(@Body() req: any) {
    try {
      return await this.vhrService.getVehicleNotAssignedVINRRequestIds(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(VRRefIdsResponseModel, error);
    }
  }
}