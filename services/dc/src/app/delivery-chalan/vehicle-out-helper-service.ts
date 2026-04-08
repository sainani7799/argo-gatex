import { CheckListStatus, CommonResponse, LocationFromTypeEnum, LocationToTypeEnum, RefIdReq, SecurityCheckRequest } from "@gatex/shared-models";
import { GrnServices, PkShippingRequestService } from "@gatex/shared-services";
import { Injectable } from "@nestjs/common";
import { TruckIdReqeust } from "./dto/truck-id-dto";
import { VehicleOTRRepository } from "./repository/vehicle-otr.repository";
import { VehicleRepository } from "./repository/vehicle.repository";

@Injectable()
export class VehicleOutHelperService {
    constructor(
        private readonly pkShippingRequestService: PkShippingRequestService,
        private grnService: GrnServices,
        private vehicleOTRRepository: VehicleOTRRepository,
        private vehicleRepository: VehicleRepository,
    ) { }

    async updateVehicleOutStatusToExternalSystem(req: TruckIdReqeust) {
        const otrRecord = await this.vehicleOTRRepository.findOne({ where: { id: Number(req.votrId) } });
        if (!otrRecord) {
            return new CommonResponse(false, 0, 'No OTR records found');
        }
        const vehicle = await this.vehicleRepository.findOne({ where: { id: req.truckId }, });
        if (!vehicle) {
            return new CommonResponse(false, 0, `No vehicle found for vehicleId: ${req.truckId}`);
        }
        try {
            switch (otrRecord.fromType) {
                case LocationFromTypeEnum.FGWH:
                    switch (otrRecord.toType) {
                        case LocationToTypeEnum.SHIP:
                            return await this.pkShippingRequestService.updateShipmentReqStatusAfterGateOut(new RefIdReq(otrRecord.refId));
                        default:
                            break;
                    }
                    break;
                case LocationFromTypeEnum.WH:
                    switch (otrRecord.toType) {
                        case LocationToTypeEnum.SUPP:
                            return await this.grnService.saveSecurityCheckOut(new SecurityCheckRequest(vehicle.createdUser, '', '', 0, Number(otrRecord.refId), vehicle.vehicleNo, vehicle.dName, vehicle.createdUser, vehicle.dContact, undefined, new Date(), Number(otrRecord?.refNumber?.split('-')[0]), CheckListStatus.VERIFIED, vehicle.vehicleNo, '', 0, 0, '', ''));
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}