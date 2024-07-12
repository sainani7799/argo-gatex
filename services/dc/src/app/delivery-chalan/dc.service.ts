import { Injectable } from '@nestjs/common';
import { DcEntityRepository } from './repository/dc-repository';
import { DcController } from './dc.controller';
import { DcDto } from './dto/dc.dto';
import { CommonResponse } from 'libs/shared-models/src/common';
import { DcEntity } from './entity/dc.entity';
import { DcAdapter } from './adapter/dc.adapter';
import { error } from 'console';
import {
  AcceptReq,
  AssignReq,
  DcIdReq,
  DcReportReq,
  ReceivedDcReq,
  RejectDcReq,
  SecurityCheckReq,
  UnitReq,
} from 'libs/shared-models';
import { UnitRepository } from '../masters/branch/repo/unit-repo';
import * as XLSX from 'xlsx';
import { DcItemEntityRepository } from './repository/dc-items.repo';

@Injectable()
export class DcService {
  constructor(
    private userRepo: DcEntityRepository,
    private dcAdapter: DcAdapter,
    private unitsRepo: UnitRepository,
    private dcItemSRepo: DcItemEntityRepository
  ) {}

  async createDc(req: DcDto, isUpdate: boolean): Promise<CommonResponse> {
    console.log('-create api call')
    try {
      const slNo = await this.userRepo.count();
      const formattedSlNo = String(Math.min(Math.max(slNo, 1), 99999)).padStart(
        5,
        '0'
      );
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const lastTwoDigitsOfYear = String(currentYear).slice(-2);
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are zero-indexed
      const day = String(currentDate.getDate()).padStart(2, '0');
      const returnablePrefix = req.returnable === 'Y' ? 'GPR' : 'GP';
      const dcNum = `${returnablePrefix}${lastTwoDigitsOfYear}${month}${day}${formattedSlNo}`;
      req.dcNumber = dcNum;
      const convertedDcEntity: DcEntity = this.dcAdapter.convertDtoToEntity(
        req,
        isUpdate
      );
      console.log(convertedDcEntity,'----coneverted entity');
      const savedDcEntity: DcEntity = await this.userRepo.save(
        convertedDcEntity
      );
      console.log(savedDcEntity,'--save dc entity')
      const savedDcDto: DcDto =this.dcAdapter.convertEntityToDto(savedDcEntity);
      if (savedDcDto) {
        const response = new CommonResponse(
          true,
          1,
          isUpdate ? 'DC Updated Successfully' : 'DC Created Successfully',
          savedDcDto
        );
        return response;
      } else {
        throw new Error('DC saved but issue while transforming into DTO');
      }
    } catch (error) {
      console.log('dc creation log')
      console.log(error)
      throw error;
    }
  }

  async updateDc(dto: AssignReq): Promise<CommonResponse> {
    const dcRecord = await this.userRepo.findOne({ where: { dcId: dto.dcId } });
    if (dcRecord) {
      const updateData = await this.userRepo.update(
        { dcId: dto.dcId },
        {
          isAssignable: dto.isAssignable,
          emailId: dto.emailId,
          assignBy: dto.assignBy,
          status: dto.status,
        }
      );
      return new CommonResponse(true, 333, 'update successfully', updateData);
    } else {
      return new CommonResponse(false, 6666, 'something went wrong');
    }
  }

  async acceptDc(dto: AcceptReq): Promise<CommonResponse> {
    const dcRecord = await this.userRepo.findOne({ where: { dcId: dto.dcId } });
    if (dcRecord) {
      const acceptData = await this.userRepo.update(
        { dcId: dto.dcId },
        {
          isAccepted: dto.isAccepted,
          acceptedUser: dto.acceptedUser,
          status: dto.status,
        }
      );
      return new CommonResponse(true, 333, 'update successfully', acceptData);
    } else {
      return new CommonResponse(false, 6666, 'something went wrong');
    }
  }

  async rejectDc(dto: RejectDcReq): Promise<CommonResponse> {
    const dcRecord = await this.userRepo.findOne({ where: { dcId: dto.dcId } });
    if (dcRecord) {
      const acceptData = await this.userRepo.update(
        { dcId: dto.dcId },
        { isAccepted: dto.isAccepted, status: dto.status }
      );
      return new CommonResponse(true, 333, 'update successfully', acceptData);
    } else {
      return new CommonResponse(false, 6666, 'something went wrong');
    }
  }

  async receivedDc(dto: ReceivedDcReq): Promise<CommonResponse> {
    const dcRecord = await this.userRepo.findOne({ where: { dcId: dto.dcId } });
    if (dcRecord) {
      const updateData = await this.userRepo.update(
        { dcId: dto.dcId },
        {
          receivedDc: dto.receivedDc,
          receivedUser: dto.receivedUser,
          status: dto.status,
          receivedDate: dto.receivedDate,
        }
      );
      return new CommonResponse(true, 333, 'update successfully', updateData);
    } else {
      return new CommonResponse(false, 6666, 'something went wrong');
    }
  }
  async securityCheckDone(dto: SecurityCheckReq): Promise<CommonResponse> {
    console.log(dto, 'SecurityCheckReq');
    const currentDate = new Date();
    const dcRecord = await this.userRepo.findOne({ where: { dcId: dto.dcId } });
    if (dcRecord) {
      const updateData = await this.userRepo.update(
        { dcId: dto.dcId },
        {
          status: dto.status,
          securityUser: dto.securityUser,
          checkoutTime: dto.checkoutTime,
          securityCheckedDate: currentDate,
        }
      );
      return new CommonResponse(true, 333, 'update successfully', updateData);
    } else {
      return new CommonResponse(false, 6666, 'something went wrong');
    }
  }
  async getAllGatePass(req: UnitReq): Promise<CommonResponse> {
    try {
      const query = `SELECT dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId, w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name WHEN dc.to_addresser = 'buyer' THEN b.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at as createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser,td.department_name AS toDepartment,dc.received_date AS receivedData,dc.attention_person AS attentionPerson
             FROM shahi_dc dc
            LEFT JOIN shahi_units u ON u.id = dc.from_unit_id
            LEFT JOIN shahi_warehouse w ON w.warehouse_id = dc. warehouse_id
            LEFT JOIN shahi_department d ON d.id = dc.department_id
            LEFT JOIN shahi_units au ON au.id = dc.addresser_name_id AND dc.to_addresser = 'unit'
            LEFT JOIN shahi_suppliers s ON s.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'supplier'
            LEFT JOIN shahi_suppliers b ON b.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'buyer'
            LEFT JOIN shahi_employees e ON e.employee_id = dc.requested_by
            LEFT JOIN shahi_employees eu ON eu.employee_id = dc.assign_by
            LEFT JOIN shahi_employees ea ON ea.employee_id = dc.accepted_user
            LEFT JOIN shahi_department td ON d.id = dc.to_department_id
            WHERE to_addresser IN ('unit', 'supplier', 'buyer') AND dc.from_unit_id = ${req.unitId} 
            GROUP BY dc.dc_id ORDER BY dc.created_at DESC`;
      const data = await this.userRepo.query(query);
      return new CommonResponse(true, 111, 'data retried successfully', data);
    } catch (error) {
      console.log(error);
    }
  }

  async getIntransAndCompleteGatePass(req: UnitReq): Promise<CommonResponse> {
    try {
      const query = `SELECT received_user AS receivedBy,received_date AS receivedDate, dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId,
            w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at AS createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser, dc.received_dc , dc.received_user,ea.employee_name AS attentionPerson
             FROM shahi_dc dc
            LEFT JOIN shahi_units u ON u.id = dc.from_unit_id
            LEFT JOIN shahi_warehouse w ON w.warehouse_id = dc. warehouse_id
            LEFT JOIN shahi_department d ON d.id = dc.department_id
            LEFT JOIN shahi_units au ON au.id = dc.addresser_name_id AND dc.to_addresser = 'unit'
            LEFT JOIN shahi_suppliers s ON s.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'supplier'
            LEFT JOIN shahi_employees e ON e.employee_id = dc.requested_by
            LEFT JOIN shahi_employees eu ON eu.employee_id = dc.assign_by
            LEFT JOIN shahi_employees ea ON ea.employee_id = dc.accepted_user
            WHERE dc.is_accepted = 'YES' AND to_addresser ='unit' AND addresser_name_id = ${req.unitId} ORDER BY dc.created_at DESC`;
      const data = await this.userRepo.query(query);
      return new CommonResponse(true, 111, 'data retried successfully', data);
    } catch (error) {
      console.log(error);
    }
  }

  async getDcDetailsById(req: DcIdReq): Promise<CommonResponse> {
    try {
      const query = `SELECT dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId,
            w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name WHEN to_addresser = 'buyer' THEN b.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy,
            dci.dc_item_id,dci.item_code AS itemCode ,dci.item_name AS itemName,dci.description,dci.uom,dci.qty,dci.rate,dci.amount ,dci.item_type AS itemType,
            dc.created_at AS createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by,
             eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser,dc.purpose,dc.vehicle_no AS vehicleNo ,
              dc.email_id AS emailId ,sa.sign_path,sa.user_signature ,dc.to_department_id,td.department_name AS toDepartment,
              dc.attention_person AS attentionPerson,dc.received_date AS receivedData,dc.received_dc AS isDcReceived,dc.received_user
             FROM shahi_dc dc
            LEFT JOIN shahi_units u ON u.id = dc.from_unit_id
            LEFT JOIN shahi_warehouse w ON w.warehouse_id = dc. warehouse_id
            LEFT JOIN shahi_department d ON d.id = dc.department_id
            LEFT JOIN shahi_department td ON td.id = dc.to_department_id
            LEFT JOIN shahi_units au ON au.id = dc.addresser_name_id AND dc.to_addresser = 'unit'
            LEFT JOIN shahi_suppliers s ON s.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'supplier'
            LEFT JOIN shahi_suppliers b ON b.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'buyer'
            LEFT JOIN shahi_employees e ON e.employee_id = dc.requested_by
            LEFT JOIN shahi_employees eu ON eu.employee_id = dc.assign_by
            LEFT JOIN shahi_employees ea ON ea.employee_id = dc.accepted_user
            LEFT JOIN shahi_dc_items dci ON dci.dc_id = dc.dc_id
            LEFT JOIN shahi_approved_users sa ON sa.approved_user_name = dc.assign_by
            WHERE to_addresser IN ('unit', 'supplier','buyer') AND dc.dc_id = ${req.dcId}`;
      const dcData = await this.userRepo.query(query);
      return await new CommonResponse(
        true,
        333,
        'DC DATA Retrieved Successfully',
        dcData
      );
    } catch (error) {
      console.log('error');
    }
  }

  async getSecurityGatePass(req: UnitReq): Promise<CommonResponse> {
    try {
      const query = `SELECT dc.security_user as CheckedUser , dc.sec_checked_date as secUserDate ,dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId,
            w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name WHEN dc.to_addresser = 'buyer' THEN b.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at AS createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser, dc.received_dc , dc.received_user
             FROM shahi_dc dc
            LEFT JOIN shahi_units u ON u.id = dc.from_unit_id
            LEFT JOIN shahi_warehouse w ON w.warehouse_id = dc. warehouse_id
            LEFT JOIN shahi_department d ON d.id = dc.department_id
            LEFT JOIN shahi_units au ON au.id = dc.addresser_name_id AND dc.to_addresser = 'unit'
            LEFT JOIN shahi_suppliers s ON s.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'supplier'
            LEFT JOIN shahi_suppliers b ON b.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'buyer'
            LEFT JOIN shahi_employees e ON e.employee_id = dc.requested_by
            LEFT JOIN shahi_employees eu ON eu.employee_id = dc.assign_by
            LEFT JOIN shahi_employees ea ON ea.employee_id = dc.accepted_user
            WHERE to_addresser IN ('unit', 'supplier','buyer') AND dc.from_unit_id = ${req.unitId} ORDER BY dc.created_at DESC`;
      const data = await this.userRepo.query(query);
      return new CommonResponse(true, 111, 'data retried successfully', data);
    } catch (error) {
      console.log(error);
    }
  }

  async ticketsExcelDownload(values): Promise<Buffer> {
    const res = await this.securityReport(values);
    const ws = XLSX.utils.json_to_sheet(res.data);
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    // Save the workbook to a buffer
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
  }

  async securityReport(req: DcReportReq): Promise<CommonResponse> {
    try {
      let query = `SELECT dc.dc_number AS dcNumber,dc.created_at AS dcDate , u.unit_name AS fromUnit ,
        CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name END AS toUnit,
        CASE WHEN to_addresser = 'supplier' THEN s.supplier_name END AS supplier ,
        CASE WHEN to_addresser = 'buyer' THEN s.supplier_name END AS buyer ,
        it.item_code AS itemCode , it.description AS DESCRIPTION , it.qty AS qty , it.uom AS uom , 
        it.rate AS rate , it.amount AS amount , dc.created_user AS createdBy, ea.employee_name AS approvedBy ,dc.security_user AS checkedBy , dc.sec_checked_date AS checkedDate , dc.received_user AS receivedBy , dc.received_date AS receivedDate , dc.purpose AS purpose , dc.remarks AS remarks,
        dc.status AS dcStatus
         FROM shahi_dc dc
        LEFT JOIN shahi_units u ON u.id = dc.from_unit_id
        LEFT JOIN shahi_warehouse w ON w.warehouse_id = dc. warehouse_id
        LEFT JOIN shahi_department d ON d.id = dc.department_id
        LEFT JOIN shahi_units au ON au.id = dc.addresser_name_id AND dc.to_addresser = 'unit'
        LEFT JOIN shahi_suppliers s ON s.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'supplier'
        LEFT JOIN shahi_employees e ON e.employee_id = dc.requested_by
        LEFT JOIN shahi_employees eu ON eu.employee_id = dc.assign_by
        LEFT JOIN shahi_employees ea ON ea.employee_id = dc.accepted_user
        LEFT JOIN shahi_dc_items it ON it.dc_id = dc.dc_id
        WHERE dc.dc_id > 0`;
      if (req.dcId) {
        query = query + ' AND dc.dc_id = ' + req.dcId;
      }
      if (req.dcFromDate != undefined) {
        query =
          query +
          ' and DATE(dc.created_at) between  "' +
          req.dcFromDate +
          '" and "' +
          req.dcToDate +
          '"';
      }
      if (req.fromUnit) {
        query = query + ' AND dc.from_unit_id = ' + req.fromUnit;
      }
      if (req.toUnit) {
        let toUnitFilter = req.toUnit.map((uf) => {
          return `'${uf}'`;
        });
        query = query + ' AND dc.addresser_name_id IN (' + toUnitFilter + ')';
      }
      if (req.itemCodeId) {
        query = query + ' AND it.dc_item_id = ' + req.itemCodeId;
      }
      if (req.approvedBy) {
        query = query + ' AND dc.accepted_user = ' + req.approvedBy;
      }
      if (req.receivedBy) {
        query = query + ` AND dc.received_user =   '${req.receivedBy}'`;
      }
      if (req.checkedBy) {
        query = query + ` AND dc.security_user = '${req.checkedBy}'`;
      }
      if (req.purpose) {
        query = query + ` AND dc.purpose =  '${req.purpose}'`;
      }
      if(req.createdBy){
        query = query + ` AND dc.created_user = '${req.createdBy}'`
      }
      query = query + '  ORDER BY dc.created_at DESC';
      console.log(query);
      const data = await this.userRepo.query(query);
      return new CommonResponse(true, 111, 'data retried successfully', data);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUnitsData(): Promise<CommonResponse> {
    const data = await this.unitsRepo.find();
    if (data.length) return new CommonResponse(true, 1, 'data retrived', data);
    return new CommonResponse(false, 0, 'No data found');
  }

  async getDcDrop(): Promise<CommonResponse> {
    const data = await this.userRepo.find();
    if (data.length) return new CommonResponse(true, 1, 'data retrived', data);
    return new CommonResponse(false, 0, 'No data found');
  }

  async getItemDrop(): Promise<CommonResponse> {
    const query = `SELECT item_code AS itemCode , dc_item_id AS itemCodeId FROM shahi_dc_items WHERE dc_item_id > 0 GROUP BY item_code`;
    const data = await this.dcItemSRepo.query(query);
    if (data.length) return new CommonResponse(true, 1, 'data retrived', data);
    return new CommonResponse(false, 0, 'No data found');
  }

  async getEmpDrop(): Promise<any> {
    let query = `SELECT sd.accepted_user AS employeeId, se.employee_name AS employeeName FROM shahi_dc sd 
        LEFT JOIN shahi_employees se ON se.employee_id = sd.accepted_user `;
    const data = await this.userRepo.query(query);
    if (data.length) return new CommonResponse(true, 1, 'data retrived', data);
    return new CommonResponse(false, 0, 'No data found');
  }

  async getApprovedBy(): Promise<CommonResponse> {
    const query = `SELECT sd.accepted_user AS employeeId,
        se.employee_name AS employeeName
 FROM shahi_dc sd
 LEFT JOIN shahi_employees se ON se.employee_id = sd.accepted_user
 WHERE sd.dc_id > 0
   AND sd.accepted_user IS NOT NULL
 GROUP BY sd.accepted_user, se.employee_name`;
    const data = await this.dcItemSRepo.query(query);
    if (data.length) return new CommonResponse(true, 1, 'data retrived', data);
    return new CommonResponse(false, 0, 'No data found');
  }

  async getCheckedBy(): Promise<CommonResponse> {
    const query = `SELECT security_user AS securityUser FROM shahi_dc WHERE dc_id > 0 AND security_user IS NOT NULL GROUP BY security_user`;
    const data = await this.dcItemSRepo.query(query);
    if (data.length) return new CommonResponse(true, 1, 'data retrived', data);
    return new CommonResponse(false, 0, 'No data found');
  }

  async getReceivedBy(): Promise<CommonResponse> {
    const query = `SELECT received_user AS receivedUser FROM shahi_dc WHERE dc_id > 0 AND received_user IS NOT NULL GROUP BY received_user`;
    const data = await this.dcItemSRepo.query(query);
    if (data.length) return new CommonResponse(true, 1, 'data retrived', data);
    return new CommonResponse(false, 0, 'No data found');
  }

  async getPurpose(): Promise<CommonResponse> {
    const query = `SELECT purpose AS purpose FROM shahi_dc WHERE dc_id > 0 AND purpose IS NOT NULL GROUP BY purpose`;
    const data = await this.dcItemSRepo.query(query);
    if (data.length) return new CommonResponse(true, 1, 'data retrived', data);
    return new CommonResponse(false, 0, 'No data found');
  }

  async getCreated(): Promise<CommonResponse> {
    const query = `SELECT created_user AS createdUser FROM shahi_dc WHERE dc_id > 0 AND created_user IS NOT NULL GROUP BY created_user`;
    const data = await this.dcItemSRepo.query(query);
    if (data.length) return new CommonResponse(true, 1, 'data retrived', data);
    return new CommonResponse(false, 0, 'No data found');
  }
}
