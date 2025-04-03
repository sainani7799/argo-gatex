import { Injectable } from '@nestjs/common';
import { ReqStatus, TruckStateEnum } from 'libs/shared-models';
import { DataSource, Repository } from 'typeorm';
import { RefIdStatusDTO } from '../dto/ref-id-status-dto';
import { VehicleOTREntity } from '../entity/vehicle-otr.entity';
import { CommonResponse } from 'libs/shared-models/src/common';
import { VehicleReqDTO } from '../dto/vehicle-req.dto';

@Injectable()
export class VehicleOTRRepository extends Repository<VehicleOTREntity> {
    constructor(private dataSource: DataSource) {
        super(VehicleOTREntity, dataSource.createEntityManager());
    }

    async getOTRALL(req: RefIdStatusDTO): Promise<any[]> {
        try {
            // Fetch Vehicle OTR records
            let query = `
            SELECT votr.id, votr.ref_id AS refId, votr.ref_number AS refNumber, votr.expected_departure AS expectedDeparture,
                   votr.from, votr.to, votr.from_type AS fromType, votr.to_type AS toType, votr.ready_to_send AS readyToSend,
                   votr.req_status AS reqStatus, votr.has_items AS hasItems, votr.is_active AS isActive,
                   votr.created_at AS createdAt, votr.created_user AS createdUser, votr.updated_at AS updatedAt,
                   votr.updated_user AS updatedUser, votr.version_flag AS versionFlag
            FROM vehicle_otr votr  
            WHERE 1=1
        `;
            if (req.refId) {
                query += ` AND votr.ref_id = '${req.refId}'`;
            }
            const vehicleOTRRecords = await this.query(query);

            // Fetch Vehicle records
            let vehicleQuery = `
            SELECT ve.id, ve.vehicle_no AS vehicleNo, ve.d_name AS dName, ve.d_contact AS dContact, 
                   ve.arrival_datetime AS arrivalDateTime, ve.departure_datetime AS departureDateTime, 
                   ve.vehicle_type AS vehicleType, ve.in_house_vehicle AS inHouseVehicle, ve.vinr_id AS vinrId, 
                   ve.votr_id AS votrId, ve.is_active AS isActive, ve.created_at AS createdAt, 
                   ve.created_user AS createdUser, ve.updated_at AS updatedAt, ve.updated_user AS updatedUser, 
                   ve.version_flag AS versionFlag
            FROM vehicle_en ve
            WHERE 1=1
        `;
            if (req.vid) {
                vehicleQuery += ` AND ve.id = ${req.vid}`;
            }
            const vehicleRecords = await this.query(vehicleQuery);

            // Fetch Vehicle state records
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

            let vehicleOTR = [];

            for (const rec of vehicleOTRRecords) {
                let veichleStateToSave = [];
                const vehRec = vehicleRecords.filter(r => r.votrId === rec.id);
                for (const data of vehRec) {
                    const vehState = vehicleStateRecords.filter(rr => rr.vid === data.id);
                    const finalVehicleStateRecords = vehState.map(state => ({
                        ...state,
                        vehicleTypeEnum: TruckStateEnum[state.vehicleType as unknown as keyof typeof TruckStateEnum] || "UNKNOWN"
                    }));
                    veichleStateToSave.push({
                        ...data,
                        vehicleStateRecords: finalVehicleStateRecords
                    });
                }
                vehicleOTR.push({
                    ...rec,
                    vehicleRecords: veichleStateToSave,
                });
            }
            const finalVehicleOTRRecords = vehicleOTR.map(votr => ({
                ...votr,
                reqStatusData: votr.reqStatus === ReqStatus.OPEN ? "OPEN" : "DONE",
                readyToSendData: votr.readyToSend === 1 ? "IN" : "OUT"
            }));

            return finalVehicleOTRRecords;

        } catch (err) {
            console.log(err);
        }


    }

    async getAllOUTVehicleByVehReq(req: VehicleReqDTO): Promise<CommonResponse> {
        try {
            let query = `
            SELECT votr.id, votr.ref_id AS refId, votr.ref_number AS refNumber, votr.expected_departure AS expectedDeparture,
                   votr.from, votr.to, votr.from_type AS fromType, votr.to_type AS toType, votr.ready_to_send AS readyToSend,
                   votr.req_status AS reqStatus, votr.has_items AS hasItems, votr.is_active AS isActive,
                   votr.created_at AS createdAt, votr.created_user AS createdUser, votr.updated_at AS updatedAt,
                   votr.updated_user AS updatedUser, votr.version_flag AS versionFlag
            FROM vehicle_otr votr  
            WHERE 1=1
        `;
            const vehicleOTRRecords = await this.query(query);

            const today = new Date().toISOString().split("T")[0];
            let vehicleQuery = `
            SELECT ve.id, ve.vehicle_no AS vehicleNo, ve.d_name AS dName, ve.d_contact AS dContact, 
                   ve.arrival_datetime AS arrivalDateTime, ve.departure_datetime AS departureDateTime, 
                   ve.vehicle_type AS vehicleType, ve.in_house_vehicle AS inHouseVehicle, ve.vinr_id AS vinrId, 
                   ve.votr_id AS votrId, ve.is_active AS isActive, ve.created_at AS createdAt, 
                   ve.created_user AS createdUser, ve.updated_at AS updatedAt, ve.updated_user AS updatedUser, 
                   ve.version_flag AS versionFlag
            FROM vehicle_en ve
             WHERE ve.vehicle_no = ?
        `;
            const params: any[] = [req.vehicleNo];
            const vehicleRecords = await this.query(vehicleQuery, params);
            if (vehicleRecords.length === 0) {
                return new CommonResponse(false, 1, 'No record found for the given vehicle number');
            }

            const departureDateQuery = `
                           SELECT * FROM vehicle_en 
                           WHERE vehicle_no = ? AND DATE(departure_datetime) = ?
                       `;

            const departureDateRecords = await this.query(departureDateQuery, [req.vehicleNo, today]);
            if (departureDateRecords.length === 0) {
                return new CommonResponse(false, 1, 'No record found for the given vehicle number with todays Departure date');

            }

            let vehicleOTR = [];

            for (const rec of vehicleOTRRecords) {
                let veichleStateToSave = [];
                const vehRec = vehicleRecords.filter(r => r.votrId === rec.id);
                for (const data of vehRec) {
                    veichleStateToSave.push({ ...data });
                }
                vehicleOTR.push({
                    ...rec,
                    vehicleRecords: veichleStateToSave,
                });
            }

            const finalVehicleOTRRecords = vehicleOTR.map(votr => ({
                ...votr,
                reqStatusData: votr.reqStatus === ReqStatus.OPEN ? "OPEN" : "DONE",
                readyToSendData: votr.readyToSend === 1 ? "IN" : "OUT"
            }));
            if (finalVehicleOTRRecords) {
                return new CommonResponse(true, 1, 'Data Retived', finalVehicleOTRRecords);
            } else {
                return new CommonResponse(false, 0, "No records found", []);
            }

        } catch (err) {
            console.log(err);
        }


    }
}