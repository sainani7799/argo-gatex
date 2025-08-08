import { Injectable } from '@nestjs/common';
import { GetVehicleNAInrReqModal, ReqStatus, TruckStateEnum } from 'libs/shared-models';
import { DataSource, Repository } from 'typeorm';
import { RefIdStatusDTO } from '../dto/ref-id-status-dto';
import { VRStatusDTO } from '../dto/vr-status-req.dto';
import { VehicleEntity } from '../entity/vehicle-en.entity';
import { VehicleINREntity } from '../entity/vehicle-inr.entity';
import { CommonResponse } from 'libs/shared-models/src/common';
import { VehicleReqDTO } from '../dto/vehicle-req.dto';

@Injectable()
export class VehicleINRRepository extends Repository<VehicleINREntity> {
    constructor(private dataSource: DataSource) {
        super(VehicleINREntity, dataSource.createEntityManager());
    }

    async getVehicleNotAssignedVINRRequestIds(req: GetVehicleNAInrReqModal): Promise<number[]> {
        const data = await this.createQueryBuilder('vinr')
            .select('GROUP_CONCAT(vinr.ref_id) as vehicleINRIds')
            .leftJoin(VehicleEntity, 'vehicle', 'vehicle.vinr_id = vinr.id')
            // .where(`vinr.unit_code = :unitCode and vinr.company_code = :companyCode`, { unitCode: req.unitCode, companyCode: req.companyCode })
            .where('vehicle.id is null')
            .andWhere(`vinr.from_type = '${req.fromType}'`)
            .getRawOne();
        return data?.vehicleINRIds?.split(',') ? data?.vehicleINRIds?.split(',') : [];
    }

    async getRefIdsByStatus(req: VRStatusDTO): Promise<number[]> {
        const data = await this.createQueryBuilder('vinr')
            .select('GROUP_CONCAT(distinct(vinr.ref_id)) as vehicleINRIds')
            .leftJoin(VehicleEntity, 'vehicle', 'vehicle.vinr_id = vinr.id')
            .where('vehicle.id is not null')
            .andWhere(`vehicle.vState in (${req.status.join(',')}) and vinr.from_type = '${req.fromType}'`)
            .getRawOne();
        console.log(data?.vehicleINRIds)
        return data?.vehicleINRIds?.split(',') ? data?.vehicleINRIds?.split(',') : [];
    }

    async getVINRALL(req: RefIdStatusDTO): Promise<any[]> {
        try {
            let vehicleInr = `
            SELECT vinr.id, vinr.ref_id AS refId, vinr.ref_number AS refNumber, vinr.expected_arrival AS expectedArrival,
                   vinr.from, vinr.to, vinr.from_type AS fromType, vinr.to_type AS toType, vinr.ready_to_in AS readyToIn,
                   vinr.req_status AS reqStatus, vinr.has_items AS hasItems, vinr.is_active AS isActive,
                   vinr.created_at AS createdAt, vinr.created_user AS createdUser, vinr.updated_at AS updatedAt,
                   vinr.updated_user AS updatedUser, vinr.version_flag AS versionFlag
            FROM vehicle_inr vinr
            WHERE 1=1
        `;
            if (req.refId) {
                vehicleInr += ` AND vinr.ref_id = '${req.refId}'`;
            }
            const vehicleINRRecords = await this.query(vehicleInr);

            let vehicleQuery = `
            SELECT ve.id, ve.vehicle_no AS vehicleNo, ve.d_name AS dName, ve.d_contact AS dContact, 
                   ve.arrival_datetime AS arrivalDateTime, ve.departure_datetime AS departureDateTime, 
                   ve.vehicle_type AS vehicleType, ve.in_house_vehicle AS inHouseVehicle, ve.vinr_id AS vinrId, 
                   ve.votr_id AS votrId, ve.is_active AS isActive, ve.created_at AS createdAt, 
                   ve.created_user AS createdUser, ve.updated_at AS updatedAt, ve.updated_user AS updatedUser, 
                   ve.version_flag AS versionFlag,ve.weight,ve.updated_weight as updateWeight
            FROM vehicle_en ve
            WHERE 1=1
        `;
            if (req.vid) {
                vehicleQuery += ` AND ve.id = ${req.vid}`;
            }
            const vehicleRecords = await this.query(vehicleQuery);

            let vehicleStateQuery = `
            SELECT vs.id, vs.vid, vs.vinr_id AS vinrId, vs.votr_id AS votrId, vs.state AS vehicleType,
                   vs.is_active AS isActive, vs.created_at AS createdAt, vs.created_user AS createdUser,
                   vs.updated_at AS updatedAt, vs.updated_user AS updatedUser, vs.version_flag AS versionFlag
            FROM vehicle_state vs
            WHERE 1=1
        `;
            if (req.status) {
                vehicleStateQuery += ` AND vs.state = ${req.status}`;
            }
            const vehicleStateRecords = await this.query(vehicleStateQuery);

            let vehicleINR = [];

            for (const rec of vehicleINRRecords) {
                let veichleStateToSave = [];
                const vehRec = vehicleRecords.filter(r => r.vinrId == rec.id);
                for (const data of vehRec) {
                    const vehState = vehicleStateRecords.filter(rr => rr.vid == data.id);
                    const finalVehicleStateRecords = vehState.map(state => ({
                        ...state,
                        vehicleTypeEnum: TruckStateEnum[state.vehicleType as unknown as keyof typeof TruckStateEnum] || "UNKNOWN"
                    }));
                    veichleStateToSave.push({
                        ...data,
                        vehicleStateRecords: finalVehicleStateRecords
                    });
                }
                vehicleINR.push({
                    ...rec,
                    vehicleRecords: veichleStateToSave,
                });
            }
            const finalVehicleINRRecords = vehicleINR.map(vinr => ({
                ...vinr,
                reqStatusData: vinr.reqStatus == ReqStatus.OPEN ? "OPEN" : "DONE",
                readyToInData: vinr.readyToIn == 1 ? "IN" : "OUT"
            }));

            return finalVehicleINRRecords;
        } catch (err) {
            console.log(err);
        }
    }

    async getAllINVehicleByVehReq(req: VehicleReqDTO): Promise<CommonResponse> {
        try {
            let vehicleInr = `
            SELECT vinr.id, vinr.ref_id AS refId, vinr.ref_number AS refNumber, vinr.expected_arrival AS expectedArrival,
                   vinr.from, vinr.to, vinr.from_type AS fromType, vinr.to_type AS toType, vinr.ready_to_in AS readyToIn,
                   vinr.req_status AS reqStatus, vinr.has_items AS hasItems, vinr.is_active AS isActive,
                   vinr.created_at AS createdAt, vinr.created_user AS createdUser, vinr.updated_at AS updatedAt,
                   vinr.updated_user AS updatedUser, vinr.version_flag AS versionFlag
            FROM vehicle_inr vinr
            WHERE 1=1
        `;
            const vehicleINRRecords = await this.query(vehicleInr);

            const today = new Date().toISOString().split("T")[0];
            let vehicleQuery = `
                SELECT ve.id, ve.vehicle_no AS vehicleNo, ve.d_name AS dName, ve.d_contact AS dContact, 
                       ve.arrival_datetime AS arrivalDateTime, ve.departure_datetime AS departureDateTime, 
                       ve.vehicle_type AS vehicleType, ve.in_house_vehicle AS inHouseVehicle, ve.vinr_id AS vinrId, 
                       ve.votr_id AS votrId, ve.is_active AS isActive, ve.created_at AS createdAt, 
                       ve.created_user AS createdUser, ve.updated_at AS updatedAt, ve.updated_user AS updatedUser, 
                       ve.version_flag AS versionFlag,ve.weight,ve.updated_weight as updateWeight
                FROM vehicle_en ve
                WHERE ve.vehicle_no = ?
            `;
            const params: any[] = [req.vehicleNo];
            const vehicleRecords = await this.query(vehicleQuery, params);
            if (vehicleRecords.length === 0) {
                return new CommonResponse(false, 1, 'No record found for the given vehicle number');
            }

            const arrivalDateQuery = `
                SELECT * FROM vehicle_en 
                WHERE vehicle_no = ? AND DATE(arrival_datetime) = ?
            `;

            const arrivalDateRecords = await this.query(arrivalDateQuery, [req.vehicleNo, today]);
            if (arrivalDateRecords.length === 0) {
                return new CommonResponse(false, 1, 'No record found for the given vehicle number with todays arrival date');

            }

            let vehicleINR = [];
            for (const rec of vehicleINRRecords) {
                let veichleStateToSave = [];
                const vehRec = vehicleRecords.filter(r => r.vinrId == rec.id);
                for (const data of vehRec) {
                    veichleStateToSave.push({ ...data });
                }
                vehicleINR.push({
                    ...rec,
                    vehicleRecords: veichleStateToSave,
                });
            }

            const finalVehicleINRRecords = vehicleINR.map(vinr => ({
                ...vinr,
                reqStatusData: vinr.reqStatus == ReqStatus.OPEN ? "OPEN" : "DONE",
                readyToInData: vinr.readyToIn == 1 ? "IN" : "OUT"
            }));
            if (finalVehicleINRRecords) {
                return new CommonResponse(true, 1, 'Data Retived', finalVehicleINRRecords); 
            } else {
                return new CommonResponse(false, 0, "No records found", []);
            }
        } catch (err) {
            console.log(err);
        }
    }

}