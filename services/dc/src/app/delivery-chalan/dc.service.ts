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
  DcEmailModel,
  DcIdReq,
  DcReportReq,
  MessageParameters,
  ReceivedDcReq,
  RejectDcReq,
  SecurityCheckReq,
  StatusEnum,
  UnitReq,
} from 'libs/shared-models';
import { UnitRepository } from '../masters/branch/repo/unit-repo';
import * as XLSX from 'xlsx';
import { DcItemEntityRepository } from './repository/dc-items.repo';
import { EmailService, WhatsAppNotificationService } from 'libs/shared-services';
import moment from 'moment';
import axios from 'axios';
import { json } from 'stream/consumers';

@Injectable()
export class DcService {
  constructor(
    private dcRepo: DcEntityRepository,
    private dcAdapter: DcAdapter,
    private unitsRepo: UnitRepository,
    private dcItemSRepo: DcItemEntityRepository,
    private wpService: WhatsAppNotificationService,
    private mailService : EmailService
  ) {}

  // async createDc(req: DcDto, isUpdate: boolean): Promise<CommonResponse> {
  //   console.log('-create api call');
  //   try {
  //     const slNoNonReturnable = await this.dcRepo.count({
  //       where: { dcType: 'nonReturnable' },
  //     });
  //     const slNoReturnable = await this.dcRepo.count({
  //       where: { dcType: 'returnable' },
  //     });

  //     const slNo =
  //       req.dcType === 'returnable' ? slNoReturnable : slNoNonReturnable;
  //     console.log(slNo, 'slNO');

  //     const nextSlNo = slNo + 1;
  //     console.log(nextSlNo, 'Next slNo');

  //     const formattedSlNo = String(
  //       Math.min(Math.max(nextSlNo, 1), 99999)
  //     ).padStart(5, '0');
  //     // const formattedSlNo = String(Math.min(Math.max(slNo, 1), 99999)).padStart(5,'0');

  //     const currentDate = new Date();
  //     const currentYear = currentDate.getFullYear();
  //     const lastTwoDigitsOfYear = String(currentYear).slice(-2);
  //     const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are zero-indexed
  //     const day = String(currentDate.getDate()).padStart(2, '0');

  //     const returnablePrefix = req.dcType === 'returnable' ? 'GPR' : 'GP';
  //     const dcNum = `${returnablePrefix}${lastTwoDigitsOfYear}${month}${day}${formattedSlNo}`;
  //     console.log(dcNum, 'dcNum');

  //     req.dcNumber = dcNum;
  //     const convertedDcEntity: DcEntity = this.dcAdapter.convertDtoToEntity(
  //       req,
  //       isUpdate
  //     );
  //     console.log(convertedDcEntity, '----coneverted entity');
  //     const savedDcEntity: DcEntity = await this.dcRepo.save(convertedDcEntity);
  //     // console.log(savedDcEntity,'--save dc entity')
  //     const savedDcDto: DcDto =
  //       this.dcAdapter.convertEntityToDto(savedDcEntity);
  //     if (savedDcDto) {
  //       const response = new CommonResponse(
  //         true,
  //         1,
  //         isUpdate ? 'DC Updated Successfully' : 'DC Created Successfully',
  //         savedDcDto
  //       );
  //       return response;
  //     } else {
  //       throw new Error('DC saved but issue while transforming into DTO');
  //     }
  //   } catch (error) {
  //     console.log('dc creation log');
  //     console.log(error);
  //     throw error;
  //   }
  // }


  async createDc(req: DcDto, isUpdate: boolean): Promise<CommonResponse> {
    console.log('-create api call');
    try {
      const slNoNonReturnable = await this.dcRepo.count({
        where: { dcType: 'nonReturnable' },
      });
      const slNoReturnable = await this.dcRepo.count({
        where: { dcType: 'returnable' },
      });

      const slNo =
        req.dcType === 'returnable' ? slNoReturnable : slNoNonReturnable;
      console.log(slNo, 'slNO');

      const nextSlNo = slNo + 1;
      console.log(nextSlNo, 'Next slNo');

      const formattedSlNo = String(
        Math.min(Math.max(nextSlNo, 1), 99999)
      ).padStart(5, '0');
      // const formattedSlNo = String(Math.min(Math.max(slNo, 1), 99999)).padStart(5,'0');

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const lastTwoDigitsOfYear = String(currentYear).slice(-2);
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are zero-indexed
      const day = String(currentDate.getDate()).padStart(2, '0');

      const returnablePrefix = req.dcType === 'returnable' ? 'GPR' : 'GP';
      const dcNum = `${returnablePrefix}${lastTwoDigitsOfYear}${month}${day}${formattedSlNo}`;
      console.log(dcNum, 'dcNum');

      req.dcNumber = dcNum;
      const convertedDcEntity: DcEntity = this.dcAdapter.convertDtoToEntity(
        req,
        isUpdate
      );
      console.log(convertedDcEntity, '----coneverted entity');
      const savedDcEntity: DcEntity = await this.dcRepo.save(convertedDcEntity);
      // console.log(savedDcEntity,'--save dc entity')
      const savedDcDto: DcDto =
        this.dcAdapter.convertEntityToDto(savedDcEntity);
        if (!savedDcDto) {
          throw new Error('DC saved but issue while transforming into DTO');
        }
        const emailAddresses = ['bhanuteja.reddi@schemaxtech.com','rajesh.nalam@schemaxtech.com','naidulokesh728@gmail.com','ajaykumarbali96@gmail.com'];
        const updatePromises = emailAddresses.map(async (email) => {
          const updatePayload = {
            dcId: savedDcDto.dcId,
            isAssignable: 'YES',
            emailId: email,
            assignBy: 8, // Example hardcoded value
            status: 'SENT FOR APPROVAL',
            dcNumber: savedDcDto.dcNumber,
            fromUnit: savedDcDto.fromUnitId,
            toAddresserName: savedDcDto.toAddresser,
            created_user: savedDcDto.createdUser,
            purpose: savedDcDto.purpose,
          };
    
          // Update DC
          const updateResponse = await this.updateDc(updatePayload);
          if (!updateResponse?.status) {
            console.error(`Failed to update DC for email ${email}`, updateResponse);
          }
    
          // Send Email
          const emailResult = await this.sendDcMailForGatePass(updatePayload);
          if (!emailResult) {
            console.error(`Failed to send email to ${email}`);
          } else {
            console.log(`Email sent successfully to ${email}`);
          }
        });
        await Promise.all(updatePromises);

        const response = new CommonResponse(
          true,
          1,
          isUpdate ? 'DC Updated Successfully' : 'DC Created Successfully',
          savedDcDto
        );
        return response;
    } catch (error) {
      console.log('dc creation log');
      console.log(error);
      throw error;
    }
  }


  private async sendDcMailForGatePass(dto: any): Promise<boolean> {
    const dcDetails = new DcEmailModel();
    dcDetails.dcNo = dto.dcNumber;
    dcDetails.to = dto.emailId;
    dcDetails.html = `
          <html>
          <head>
            <meta charset="UTF-8" />
            <style>
              #acceptDcLink {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #28a745;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 10px;
                    transition: background-color 0.3s ease, color 0.3s ease;
                    cursor: pointer;
                }
                #acceptDcLink.accepted {
                    background-color: #6c757d;
                    cursor: not-allowed;
                }
                #acceptDcLink:hover {
                    background-color: #218838;
                    color: #fff;
                }
            </style>
          </head>
          <body>
            <p>Dear team,</p>
            <p>Please find the Gate Pass details below:</p>
            <p>DC NO: ${dto.dcNumber}</p>
            <p>DC created user name : ${dto.created_user}</p>
            <p>Purpose of this DC : ${dto.purpose}</p>
            <p>Please click the link below for details:</p>
            <input type="hidden" id="assignBy" value=${dto.assignBy} /> 
            <input type="hidden" id="dcId" value=${dto.dcId} />
        
            <a
              href="https://gatex.schemaxtech.in/#/dc-email-detail-view/${dto.dcId}"
              style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
              "
              >View Details of GatePass</a
            >
            <a
            href="https://gatex.schemaxtech.in/#/dc-email/${dto.dcId}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #108f1a;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            "
            >Accept Gate Pass</a
          >
          <a
            href="https://gatex.schemaxtech.in/#/dc-reject-mail/${dto.dcId}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #ff001e;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            "
            >Reject Gate Pass</a
          >
          </body>
        </html>
        `;
    dcDetails.subject = 'Gate Pass : ' + dto.dcNumber;
  
    try {
      const res = await this.mailService.sendDcMail(dcDetails);
      return res.status === 201 && res.data.status;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // async updateDc(dto: AssignReq): Promise<CommonResponse> {
  //   const dcRecord = await this.dcRepo.findOne({ where: { dcId: dto.dcId } });
  //   if (dcRecord) {
  //     const updateData = await this.dcRepo.update(
  //       { dcId: dto.dcId },
  //       {
  //         isAssignable: dto.isAssignable,
  //         emailId: dto.emailId,
  //         assignBy: dto.assignBy,
  //         status: dto.status,
  //       }
  //     );
  //     return new CommonResponse(true, 333, 'update successfully', updateData);
  //   } else {
  //     return new CommonResponse(false, 6666, 'something went wrong');
  //   }
  // }

  async updateDc(dto: any): Promise<CommonResponse> {
    // Fetch the existing record
    const dcRecord = await this.dcRepo.findOne({ where: { dcId: dto.dcId } });

    if (!dcRecord) {
      return new CommonResponse(
        false,
        6666,
        'Something went wrong: DC record not found.'
      );
    }

    // Update the DC record
    const updateData = await this.dcRepo.update(
      { dcId: dto.dcId },
      {
        isAssignable: dto.isAssignable,
        emailId: dto.emailId,
        assignBy: dto.assignBy,
        status: dto.status,
      }
    );

    // Generate WhatsApp Message Content
    const contacts = ['917036716813']; // List of contacts (as an array)
    let messageContent = `Please find the Gate Pass details below: \\n`
    messageContent += `*DC No: ${dto.dcNumber || 'N/A'}* \\n`
    messageContent += `*From: ${dto.fromUnit || 'N/A'}* \\n`
    messageContent += `*To: ${dto.toAddresserName || 'N/A'}* \\n`
    messageContent += `*Created By: ${dto.created_user || 'N/A'}* \\n`
    messageContent += `*Purpose: ${dto.purpose || 'N/A'}* \\n`
    messageContent +=`Please click the link below for details`;

    // Parameters for the WhatsApp template
    const parameters = [
      { type: 'text', text: messageContent }, // Message body
    ];
    try {
      for (const contact of contacts) {
        // Construct the request for WhatsApp API
        const req = new MessageParameters(
          contact,
          'gatepass_approval',
          parameters,
          'en_us',
          dto.dcId,
          dto.dcId
        );

        // Send the message
        const messageStatus =
          await this.wpService.sendMessageWithButtonParamsThroughFbApi(req);

        // Log the status
        if (!messageStatus.status) {
          console.error(`Failed to send message to ${contact}:`, messageStatus);
        } else {
          console.log(`Message sent successfully to ${contact}`);
        }
      }
     

      return new CommonResponse(
        true,
        333,
        'Updated and sent WhatsApp messages successfully',
        updateData
      );
    } catch (err) {
      console.error('Error while sending WhatsApp messages:', err);
      return new CommonResponse(false, 11108, 'Error while sending message');
    }
  }

  async acceptDc(dto: AcceptReq): Promise<CommonResponse> {
    const dcRecord = await this.dcRepo.findOne({ where: { dcId: dto.dcId } });
    if (dcRecord) {
      const acceptData = await this.dcRepo.update(
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
    const dcRecord = await this.dcRepo.findOne({ where: { dcId: dto.dcId } });
    if (dcRecord) {
      const acceptData = await this.dcRepo.update(
        { dcId: dto.dcId },
        { isAccepted: dto.isAccepted, status: dto.status }
      );
      return new CommonResponse(true, 333, 'update successfully', acceptData);
    } else {
      return new CommonResponse(false, 6666, 'something went wrong');
    }
  }

  async receivedDc(dto: ReceivedDcReq): Promise<CommonResponse> {
    console.log(dto, 'dtooo');
    const dcRecord = await this.dcRepo.findOne({ where: { dcId: dto.dcId } });
    if (dcRecord) {
      const updateData: { [key: string]: any } = {
        status: dto.status,
      };

      if (dto.returnedDate) {
        updateData.returnedDate = dto.returnedDate;
      } else if (dto.receivedDate !== null) {
        updateData.receivedDate = dto.receivedDate;
        updateData.receivedDc = dto.receivedDc;
        updateData.receivedUser = dto.receivedUser;
      }

      console.log(updateData, 'update data');
      // FIXME: in console it is coming only returned date  , but it is updating recieved DC also

      const result = await this.dcRepo.update({ dcId: dto.dcId }, updateData);

      // const updateData = await this.dcRepo.update(
      //   { dcId: dto.dcId },
      //   {
      //     receivedDc: dto.receivedDc,
      //     receivedUser: dto.receivedUser,
      //     status: dto.status,
      //     receivedDate: dto.receivedDate,
      //   }
      // );
      return new CommonResponse(true, 333, 'update successfully', result);
    } else {
      return new CommonResponse(false, 6666, 'something went wrong');
    }
  }

  // async securityCheckDone(dto: SecurityCheckReq): Promise<CommonResponse> {
  //   console.log(dto, 'SecurityCheckReq');
  //   const currentDate = new Date();
  //   const dcRecord = await this.dcRepo.findOne({ where: { dcId: dto.dcId } });
  //   if (dcRecord) {
  //     const updateData = await this.dcRepo.update(
  //       { dcId: dto.dcId },
  //       {
  //         status: dto.status,
  //         securityUser: dto.securityUser,
  //         checkoutTime: dto.checkoutTime,
  //         securityCheckedDate: currentDate,
  //       }
  //     );
  //     return new CommonResponse(true, 333, 'update successfully', updateData);
  //   } else {
  //     return new CommonResponse(false, 6666, 'something went wrong');
  //   }
  // }

  async securityCheckDone(dto: SecurityCheckReq): Promise<CommonResponse> {
    console.log(dto, "SecurityCheckReq");
    const currentDate = new Date();
  
    // Fetch the DC record
    const dcRecord = await this.dcRepo.findOne({ where: { dcId: dto.dcId } });
    if (!dcRecord) {
      return new CommonResponse(false, 6666, "Dispatch Challan not found");
    }
  
    const dispatchChallanNo = dcRecord.dispatchChallanNo;
  
    const validatePayload = {
      username: "admin", // from gate pass
      unitCode: "B3", // hardcoded
      companyCode: "5000", // hardcoded
      userId: 20, // replace with actual user ID
      srIds: [dispatchChallanNo], // required challanNo
      remarks: "",
      iNeedVendorInfoAlso: false,
      iNeedTruckInfoAlso: false,
      iNeedSrItemsAlso: false,
      iNeedSrItemsAttrAlso: false,
    };
  
    try {
      console.log('-----------')
      const validateResponse = await axios.post(
        "https://xpparel-demo-pkdms.schemaxtech.in/shipping-request/validateCheckoutShippingRequest",
        validatePayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!validateResponse?.data || validateResponse?.data?.status !== true) {
        return new CommonResponse(false, 6667, "Validation failed for Shipping Request");
      }
      const approvePayload = {
        username: "admin", // from gate pass
        unitCode: "B3", // hardcoded
        companyCode: "5000", // hardcoded
        userId: 20, // replace with actual user ID
        srId: dispatchChallanNo, // required challanNo
        remarks: "",
        truckOutTimes: [{truckId: 0, checkoutDateTime: null,  remarks: null}]
      };
  
      const approveResponse = await axios.post(
        "https://xpparel-demo-pkdms.schemaxtech.in/shipping-request/checkoutShippingRequest",
        approvePayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(approveResponse.data)
  
      if (!approveResponse?.data || approveResponse?.data?.status !== true) {
        return new CommonResponse(false, 6668, 'Approved');
      }
  
      const updateData = await this.dcRepo.update(
        { dcId: dto.dcId },
        {
          status: dto.status,
          securityUser: dto.securityUser,
          checkoutTime: dto.checkoutTime,
          securityCheckedDate: currentDate,
        }
      );
  
      return new CommonResponse(true, 333, "Updated successfully", updateData);
    } catch (error) {
      console.error("Error in securityCheckDone:", error.message || error);
      return new CommonResponse(false, 9999, "An error occurred during the security check");
    }
  }
  

  async securityCheckIn(dto: SecurityCheckReq): Promise<CommonResponse> {
    console.log(dto, 'SecurityCheckReq');
    const currentDate = new Date();
    const dcRecord = await this.dcRepo.findOne({ where: { dcId: dto.dcId } });
    if (dcRecord) {
      const updateData = await this.dcRepo.update(
        { dcId: dto.dcId },
        {
          status: dto.status,
          securityUser: dto.securityUser,
          checkInTime: dto.chechInTime,
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
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at as createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser,td.department_name AS toDepartment,dc.received_date AS receivedData,dc.attention_person AS attentionPerson , dc.buyer_team AS buyerTeam , dc.purpose , e.email_id AS emailId , dc.dc_type AS dcType,dc.returned_date AS returnedDate , dc.expected_return_date AS expectedReturnDate
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
      const data = await this.dcRepo.query(query);
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
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at AS createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser, dc.received_dc , dc.received_user,ea.employee_name AS attentionPerson,a.email_id AS emailId, dc.dc_type AS dcType
             FROM shahi_dc dc
            LEFT JOIN shahi_units u ON u.id = dc.from_unit_id
            LEFT JOIN shahi_warehouse w ON w.warehouse_id = dc. warehouse_id
            LEFT JOIN shahi_department d ON d.id = dc.department_id
            LEFT JOIN shahi_units au ON au.id = dc.addresser_name_id AND dc.to_addresser = 'unit'
            LEFT JOIN shahi_suppliers s ON s.supplier_id = dc.addresser_name_id AND dc.to_addresser = 'supplier'
            LEFT JOIN shahi_employees e ON e.employee_id = dc.requested_by
            LEFT JOIN shahi_employees eu ON eu.employee_id = dc.assign_by
            LEFT JOIN shahi_employees ea ON ea.employee_id = dc.accepted_user
            LEFT JOIN shahi_approved_users a ON a.approved_user_name = dc.requested_by
            WHERE dc.is_accepted = 'YES' AND to_addresser ='unit' AND addresser_name_id = ${req.unitId} ORDER BY dc.created_at DESC`;
      const data = await this.dcRepo.query(query);
      return new CommonResponse(true, 111, 'data retried successfully', data);
    } catch (error) {
      console.log(error);
    }
  }

  async getDcDetailsById(req: DcIdReq): Promise<CommonResponse> {
    try {
      const query = `SELECT dc.dc_id AS dcId ,dc.dc_number AS dcNumber ,dc.dispatch_challan_no AS dispatchChallanNo, dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId,
            w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name WHEN to_addresser = 'buyer' THEN b.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy,
            dci.dc_item_id,dci.item_code AS itemCode ,dci.item_name AS itemName,dci.description,dci.uom,dci.po_number AS poNumber,dci.color,dci.style,dci.pieces,dci.qty,dci.rate,dci.amount ,dci.item_type AS itemType,
            dc.created_at AS createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by,dc.dc_type AS dcType,
             eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser,dc.purpose,dc.vehicle_no AS vehicleNo ,
              dc.email_id AS emailId ,sa.sign_path,sa.user_signature ,dc.to_department_id,td.department_name AS toDepartment,
              dc.attention_person AS attentionPerson,dc.received_date AS receivedData,dc.received_dc AS isDcReceived,dc.received_user , dci.returning_qty AS returningQty , dci.return_remarks AS returnRemarks , dci.write_off_qty AS writeOffQty  , se.email_id AS createdUserMail
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
            LEFT JOIN shahi_employees se ON se.employee_id = dc.requested_by
            WHERE to_addresser IN ('unit', 'supplier','buyer') AND dc.dc_id = ${req.dcId}`;
      const dcData = await this.dcRepo.query(query);
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
            w.warehouse_name AS warehouseName,dc.dispatch_challan_no AS dispatchChallanNo,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name WHEN dc.to_addresser = 'buyer' THEN b.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at AS createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser, dc.received_dc , dc.received_user , dc.dc_type AS dcType
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
      const data = await this.dcRepo.query(query);
      return new CommonResponse(true, 111, 'data retried successfully', data);
    } catch (error) {
      console.log(error);
    }
  }

  async getSecurityInGatePass(req: UnitReq): Promise<CommonResponse> {
    try {
      const query = `SELECT dc.security_user as CheckedUser , dc.sec_checked_date as secUserDate ,dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId,
            w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name WHEN dc.to_addresser = 'buyer' THEN b.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at AS createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser, dc.received_dc , dc.received_user , dc.dc_type AS dcType
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
            WHERE to_addresser IN ('unit', 'supplier','buyer') AND dc.addresser_name_id = ${req.unitId} ORDER BY dc.created_at DESC`;
      const data = await this.dcRepo.query(query);
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
        dc.status AS dcStatus , dc.buyer_team AS buyerTeam , dc.dc_type AS dcType , dc.returned_by AS returnedBy , dc.returned_date AS returnedDate
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
      if (req.createdBy) {
        query = query + ` AND dc.created_user = '${req.createdBy}'`;
      }
      query = query + '  ORDER BY dc.created_at DESC';
      console.log(query);
      const data = await this.dcRepo.query(query);
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
    const data = await this.dcRepo.find();
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
    const data = await this.dcRepo.query(query);
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

  async getAllGatePassTounit(req: UnitReq): Promise<CommonResponse> {
    try {
      const query = `SELECT dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId, w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name WHEN dc.to_addresser = 'buyer' THEN b.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at as createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser,td.department_name AS toDepartment,dc.received_date AS receivedData,dc.attention_person AS attentionPerson , dc.buyer_team AS buyerTeam , dc.purpose , e.email_id AS emailId , dc.dc_type AS dcType,dc.expected_return_date AS expectedReturnDate
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
            WHERE to_addresser IN ('unit', 'supplier', 'buyer') AND dc.addresser_name_id = ${req.unitId} 
            GROUP BY dc.dc_id ORDER BY dc.created_at DESC`;
      const data = await this.dcRepo.query(query);
      return new CommonResponse(true, 111, 'data retried successfully', data);
    } catch (error) {
      console.log(error);
    }
  }

  async updateRetunableData(req: any): Promise<CommonResponse> {
    console.log(req, 'req');
    try {
      await this.dcRepo.update(
        { dcId: req.dcId },
        {
          toDepartmentId: req.dc.toDepartmentId,
          attentionPerson: req.dc.attentionPerson,
          status: req.status,
          fromUnitId: req.dc.fromUnitIdOnly,
          addresserNameId: req.dc.toUnitId,
          returnedBy: req.returnedBy,
        }
      );
      for (const i of req.dcItem) {
        await this.dcItemSRepo.update(
          { dcItemId: i.dcItemId },
          {
            returningQty: i.returnQty,
            returnRemarks: i.returnRemarks,
            writeOffQty: i.writeOffQty,
          }
        );
      }
      return new CommonResponse(true, 1, 'Data updated successfully');
    } catch (err) {
      return new CommonResponse(false, 0, 'Updation failed');
    }
  }

  async getAllGatePassReturnable(req: UnitReq): Promise<CommonResponse> {
    try {
      const query = `SELECT dc.dc_id AS dcId ,dc.dc_number AS dcNumber , dc.from_unit_id AS fromUnitId, u.unit_name AS fromUnit ,dc.warehouse_id AS warehouseId, w.warehouse_name AS warehouseName,
            CASE WHEN dc.to_addresser = 'unit' THEN au.unit_name WHEN to_addresser = 'supplier' THEN s.supplier_name WHEN dc.to_addresser = 'buyer' THEN b.supplier_name END AS toAddresserName ,
            po_no AS poNo ,mode_of_transport AS modeOfTransport , to_addresser AS toAddresser ,addresser_name_id AS toAddresserNameId,
            weight,department_id AS departmentId, d.department_name AS department,dc.requested_by AS requestedById, e.employee_name AS requestedBy , dc.created_at as createdDate,dc.created_user,dc.status,dc.value,dc.returnable,dc.remarks,dc.is_assignable AS isDcAssign,dc.assign_by, eu.employee_name AS assignBy,dc.is_accepted , ea.employee_name AS acceptedUser,td.department_name AS toDepartment,dc.received_date AS receivedData,dc.attention_person AS attentionPerson , dc.buyer_team AS buyerTeam , dc.purpose , e.email_id AS emailId , dc.dc_type AS dcType,dc.returned_date AS returnedDate
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
            WHERE to_addresser IN ('unit', 'supplier', 'buyer') AND dc.addresser_name_id = ${req.unitId} AND dc.dc_type = 'returnable'
            GROUP BY dc.dc_id ORDER BY dc.created_at DESC`;
      const data = await this.dcRepo.query(query);
      return new CommonResponse(true, 111, 'data retried successfully', data);
    } catch (error) {
      console.log(error);
    }
  }

  async getIdByDc(req: DcDto): Promise<CommonResponse> {
    const data = await this.dcRepo.findOne({
      where: { dcNumber: req.dcNumber },
    });
    if (data) {
      return new CommonResponse(true, 1, 'Data retrieved', data);
    }
    return new CommonResponse(false, 0, 'No data found');
  }
}
