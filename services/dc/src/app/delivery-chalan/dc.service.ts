import { Injectable } from "@nestjs/common";
import { DcEntityRepository } from "./repository/dc-repository";
import { DcController } from "./dc.controller";
import { DcDto } from "./dto/dc.dto";
import { CommonResponse } from "libs/shared-models/src/common";
import { DcEntity } from "./entity/dc.entity";
import { DcAdapter } from "./adapter/dc.adapter";
import { error } from "console";
import { AcceptReq, AssignReq, DcIdReq, ReceivedDcReq, RejectDcReq, UnitReq } from "libs/shared-models";

@Injectable()
export class DcService {
    constructor(
        private userRepo: DcEntityRepository,
        private dcAdapter: DcAdapter,

    ) { }

    async createDc(req: DcDto, isUpdate: boolean): Promise<CommonResponse> {
        try {
            const slNo = await this.userRepo.count()
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const lastTwoDigitsOfYear = String(currentYear).slice(-2);
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are zero-indexed
            const day = String(currentDate.getDate()).padStart(2, '0');
            const returnablePrefix = req.returnable === 'Y' ? 'GPR' : 'GP';
            const dcNum = `${returnablePrefix}${lastTwoDigitsOfYear}${month}${day}${Number(Number(slNo))}`;
            req.dcNumber = dcNum;
            const convertedDcEntity: DcEntity = this.dcAdapter.convertDtoToEntity(req, isUpdate);
            console.log(convertedDcEntity)
            const savedDcEntity: DcEntity = await this.userRepo.save(convertedDcEntity);
            const savedDcDto: DcDto = this.dcAdapter.convertEntityToDto(savedDcEntity);
            if (savedDcDto) {
                const response = new CommonResponse(true, 1, isUpdate ? 'DC Updated Successfully' : 'DC Created Successfully', savedDcDto);
                return response;
            } else {
                throw new Error('DC saved but issue while transforming into DTO');
            }
        } catch (error) {
            throw error;
        }
    }

    async updateDc(dto: AssignReq): Promise<CommonResponse> {
        console.log(dto, 'updateDto')
        const dcRecord = await this.userRepo.findOne({ where: { dcId: dto.dcId } })
        if (dcRecord) {
            const updateData = await this.userRepo.update({ dcId: dto.dcId }, { isAssignable: dto.isAssignable, emailId: dto.emailId, assignBy: dto.assignBy, status: dto.status })
            return new CommonResponse(true, 333, 'update successfully', updateData)
        } else {
            return new CommonResponse(false, 6666, 'something went wrong')
        }
    }

    async acceptDc(dto: AcceptReq): Promise<CommonResponse> {
        console.log(dto, 'acceptDcReq')
        const dcRecord = await this.userRepo.findOne({ where: { dcId: dto.dcId } })
        if (dcRecord) {
            const acceptData = await this.userRepo.update({ dcId: dto.dcId }, { isAccepted: dto.isAccepted, acceptedUser: dto.acceptedUser, status: dto.status })
            return new CommonResponse(true, 333, 'update successfully', acceptData)
        } else {
            return new CommonResponse(false, 6666, 'something went wrong')
        }
    }

    async rejectDc(dto: RejectDcReq): Promise<CommonResponse> {
        console.log(dto, 'acceptDcReq')
        const dcRecord = await this.userRepo.findOne({ where: { dcId: dto.dcId } })
        if (dcRecord) {
            const acceptData = await this.userRepo.update({ dcId: dto.dcId }, { isAccepted: dto.isAccepted, status: dto.status })
            return new CommonResponse(true, 333, 'update successfully', acceptData)
        } else {
            return new CommonResponse(false, 6666, 'something went wrong')
        }
    }


    async receivedDc(dto: ReceivedDcReq): Promise<CommonResponse> {
        console.log(dto, 'ReceivedDcReq')
        const dcRecord = await this.userRepo.findOne({ where: { dcId: dto.dcId } })
        if (dcRecord) {
            const updateData = await this.userRepo.update({ dcId: dto.dcId }, { receivedDc: dto.receivedDc, receivedUser: dto.receivedUser, status: dto.status, receivedDate: dto.receivedDate })
            return new CommonResponse(true, 333, 'update successfully', updateData)
        } else {
            return new CommonResponse(false, 6666, 'something went wrong')
        }
    }
    async getAllGatePass(req: UnitReq): Promise<CommonResponse> {
        try {
            const query = `SELECT dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId, w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at as createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser
             FROM shahi_dc dc
            LEFT JOIN shahi_units u ON u.id = dc.from_unit_id
            LEFT JOIN shahi_warehouse w ON w.warehouse_id = dc. warehouse_id
            LEFT JOIN shahi_department d ON d.id = dc.department_id
            LEFT JOIN shahi_units au ON au.id = dc.addresser_name_id AND dc.to_addresser = 'unit'
            LEFT JOIN shahi_suppliers s ON s.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'supplier'
            LEFT JOIN shahi_employees e ON e.employee_id = dc.requested_by
            LEFT JOIN shahi_employees eu ON eu.employee_id = dc.assign_by
            LEFT JOIN shahi_employees ea ON ea.employee_id = dc.accepted_user
            WHERE to_addresser IN ('unit', 'supplier') AND dc.from_unit_id = ${req.unitId}`;
            const data = await this.userRepo.query(query)
            return new CommonResponse(true, 111, 'data retried successfully', data)
        } catch (error) {
            console.log(error)
        }
    }

    async getIntransAndCompleteGatePass(req: UnitReq): Promise<CommonResponse> {
        try {
            const query = `SELECT dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId,
            w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at AS createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser, dc.received_dc , dc.received_user
             FROM shahi_dc dc
            LEFT JOIN shahi_units u ON u.id = dc.from_unit_id
            LEFT JOIN shahi_warehouse w ON w.warehouse_id = dc. warehouse_id
            LEFT JOIN shahi_department d ON d.id = dc.department_id
            LEFT JOIN shahi_units au ON au.id = dc.addresser_name_id AND dc.to_addresser = 'unit'
            LEFT JOIN shahi_suppliers s ON s.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'supplier'
            LEFT JOIN shahi_employees e ON e.employee_id = dc.requested_by
            LEFT JOIN shahi_employees eu ON eu.employee_id = dc.assign_by
            LEFT JOIN shahi_employees ea ON ea.employee_id = dc.accepted_user
            WHERE dc.is_accepted = 'YES' AND to_addresser ='unit' AND addresser_name_id = ${req.unitId}`;
            const data = await this.userRepo.query(query)
            return new CommonResponse(true, 111, 'data retried successfully', data)
        } catch (error) {
            console.log(error)
        }
    }

    async getDcDetailsById(req: DcIdReq): Promise<CommonResponse> {
        try {
            const query = `SELECT dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId,
            w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy,
            dci.dc_item_id,dci.item_code AS itemCode ,dci.item_name AS itemName,dci.description,dci.uom,dci.qty,dci.rate,dci.amount , dc.created_at as createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser,dc.purpose,dc.vehicle_no as vehicleNo , dc.email_id as emailId ,sa.sign_path,sa.user_signature
             FROM shahi_dc dc
            LEFT JOIN shahi_units u ON u.id = dc.from_unit_id
            LEFT JOIN shahi_warehouse w ON w.warehouse_id = dc. warehouse_id
            LEFT JOIN shahi_department d ON d.id = dc.department_id
            LEFT JOIN shahi_units au ON au.id = dc.addresser_name_id AND dc.to_addresser = 'unit'
            LEFT JOIN shahi_suppliers s ON s.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'supplier'
            LEFT JOIN shahi_employees e ON e.employee_id = dc.requested_by
            LEFT JOIN shahi_employees eu ON eu.employee_id = dc.assign_by
            LEFT JOIN shahi_employees ea ON ea.employee_id = dc.accepted_user
            LEFT JOIN shahi_dc_items dci ON dci.dc_id = dc.dc_id
            LEFT JOIN shahi_approved_users sa ON sa.approved_user_name = dc.assign_by
            WHERE to_addresser IN ('unit', 'supplier') AND dc.dc_id = ${req.dcId}`;
            const dcData = await this.userRepo.query(query)
            return await new CommonResponse(true, 333, 'DC DATA Retrieved Successfully', dcData)

        } catch (error) {
            console.log('error')
        }
    }
}