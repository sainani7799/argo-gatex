import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { returnException } from "libs/backend-utils/src/lib/libs/application-exception-handler";
import { ADDHistoryReqModel, ADDVehicleReqModal, GetVehicleNAInrReqModal, GetVehicleResModel, VRRefIdsResponseModel } from "libs/shared-models";
import { CommonResponse } from "libs/shared-models/src/common";
import { RefIdStatusDTO } from "./dto/ref-id-status-dto";
import { TruckIdReqeust } from "./dto/truck-id-dto";
import { VehicleDto } from "./dto/vehicle-en.dto";
import { VehicleINRDto } from "./dto/vehicle-inr-dto";
import { VehicleOTRDto } from "./dto/vehicle-out.dto";
import { VRStatusDTO } from "./dto/vr-status-req.dto";
import { VHRService } from "./vhr.service";

@ApiTags('Vehicle Request')
@Controller("vhr")
export class VHRController {
  constructor(
    private readonly vhrService: VHRService,
  ) { }

  @Post('/createVINR')
  @ApiBody({ type: [VehicleINRDto] })
  async createVINR(@Body() req: any[]): Promise<CommonResponse> {
    try {
      return await this.vhrService.createVINR(req);
    } catch (error) {
      return returnException(CommonResponse, error);
    }
  }

  @Post('/createVOTR')
  @ApiBody({ type: [VehicleOTRDto] })
  async createVOTR(@Body() req: any[]): Promise<CommonResponse> {
    try {
      return await this.vhrService.createVOTR(req);
    } catch (error) {
      return returnException(CommonResponse, error);
    }

  }

  @Post('/getVINR')
  @ApiBody({ type: [RefIdStatusDTO] })
  async getVINR(@Body() req: any[]): Promise<CommonResponse> {
    try {
      return await this.vhrService.getVINR(req);
    } catch (error) {
      return returnException(CommonResponse, error);
    }
  }

  @Post('/getVOTR')
  @ApiBody({ type: [RefIdStatusDTO] })
  async getVOTR(@Body() req: any[]): Promise<CommonResponse> {
    try {
      return await this.vhrService.getVOTR(req);
    } catch (error) {
      return returnException(CommonResponse, error);
    }
  }

  @Post('/getTruckInfoByTruckId')
  @ApiBody({ type: TruckIdReqeust })
  async getTruckInfoByTruckId(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.getTruckInfoByTruckId(req);
    } catch (error) {
      return returnException(CommonResponse, error);
    }
  }

  @Post('/updateTruckState')
  @ApiBody({ type: TruckIdReqeust })
  async updateTruckState(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.updateTruckState(req);
    } catch (error) {
      return returnException(CommonResponse, error);
    }
  }

  @Post('/getVehicleRecordForReferenceId')
  @ApiBody({ type: RefIdStatusDTO })
  async getVehicleRecordForReferenceId(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.getVehicleRecordForReferenceId(req);
    } catch (error) {
      return returnException(CommonResponse, error);
    }
  }

  @Post('/getRefIdsByStatus')
  @ApiBody({ type: VRStatusDTO })
  async getRefIdsByStatus(@Body() req: any): Promise<VRRefIdsResponseModel> {
    try {
      return await this.vhrService.getRefIdsByStatus(req);
    } catch (error) {
      return returnException(VRRefIdsResponseModel, error);
    }
  }

  @Post('/getVehicleNotAssignedVINRRequestIds')
  @ApiBody({ type: GetVehicleNAInrReqModal })
  async getVehicleNotAssignedVINRRequestIds(@Body() req: any) {
    try {
      return await this.vhrService.getVehicleNotAssignedVINRRequestIds(req);
    } catch (error) {
      return returnException(VRRefIdsResponseModel, error);
    }
  }

  @Post('/addVehicleToVINR')
  @ApiBody({ type: ADDVehicleReqModal })
  async addVehicleToVINR(@Body() req: any) {
    try {
      return await this.vhrService.addVehicleToVINR(req);
    } catch (error) {
      return returnException(VRRefIdsResponseModel, error);
    }
  }

  @Post('/getVehicleDetails')
  @ApiBody({ type: ADDVehicleReqModal })
  async getVehicleDetails(@Body() req: any): Promise<GetVehicleResModel> {
    try {
      return await this.vhrService.getVehicleDetails(req);
    } catch (error) {
      return returnException(GetVehicleResModel, error);
    }
  }
  @Post('/addHistoryRecords')
  @ApiBody({ type: ADDHistoryReqModel })
  async addHistoryRecords(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.addHistoryRecords(req);
    } catch (error) {
      return returnException(CommonResponse, error);
    }
  }

  @Post('/createVehicle')
  @ApiBody({ type: [VehicleDto] })
  async createVehicle(@Body() req: any[]): Promise<CommonResponse> {
    try {
      return await this.vhrService.createVehicle(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/getVINRALL')
  @ApiBody({ type: RefIdStatusDTO })
  async getVINRALL(@Body() req?: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.getVINRALL(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/getVOTRALL')
  @ApiBody({ type: RefIdStatusDTO })
  async getVOTRALL(@Body() req?: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.getVOTRALL(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/updateVehicleState')
  @ApiBody({ type: TruckIdReqeust })
  async updateVehicleState(@Body() req: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.updateVehicleState(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/updateDepartureAndStatus')
  @ApiBody({ type: TruckIdReqeust })
  async updateDepartureAndStatus(@Body() req: any): Promise<any> {
    try {
      return await this.vhrService.updateDepartureAndStatus(req);
    } catch (error) {
      return (error);
    }
  }

  @Post('/getAllVehicleByVehReq')
  @ApiBody({ type: RefIdStatusDTO })
  async getAllVehicleByVehReq(@Body() req?: any): Promise<CommonResponse> {
    try {
      return await this.vhrService.getAllVehicleByVehReq(req);
    } catch (error) {
      return (error);
    }
  }
}