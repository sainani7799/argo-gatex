import { ADDHistoryReqModel, ADDVehicleReqModal, CheckListStatus, CommonResponse, DcEmailModel, GatePassStatus, GetVehicleNAInrReqModal, GetVehicleResModel, HistoryRecord, LocationFromTypeEnum, LocationToTypeEnum, RefIdReq, ReqStatus, SecurityCheckRequest, TruckStateEnum, VehicleModal, VRRefIdsResponseModel } from '@gatex/shared-models';
import { configVariables, GrnServices } from '@gatex/shared-services';
import { Injectable } from '@nestjs/common';
import { ErrorResponse } from 'libs/backend-utils/src/lib/libs/global-res-object';
import { AxiosInstance } from 'libs/shared-services/src/axios-instance';
import { DataSource, In, Raw } from 'typeorm';
import { RefIdStatusDTO } from './dto/ref-id-status-dto';
import { TruckIdReqeust } from './dto/truck-id-dto';
import { VehicleDto } from './dto/vehicle-en.dto';
import { VehicleINRDto } from './dto/vehicle-inr-dto';
import { VehicleOTRDto } from './dto/vehicle-out.dto';
import { VehicleReqDTO } from './dto/vehicle-req.dto';
import { VehicleStatusDTO } from './dto/vehicle-status.dto';
import { VRStatusDTO } from './dto/vr-status-req.dto';
import { VehicleEntity } from './entity/vehicle-en.entity';
import { VehicleINREntity } from './entity/vehicle-inr.entity';
import { VehicleOTREntity } from './entity/vehicle-otr.entity';
import { VehicleStateEntity } from './entity/vehicle-state.entity';
import { VehicleINRRepository } from './repository/vehicle-inr.repository';
import { VehicleOTRRepository } from './repository/vehicle-otr.repository';
import { VehicleStateRepository } from './repository/vehicle-state.repo';
import { VehicleRepository } from './repository/vehicle.repository';
import { MailerService } from './send-mail';
import { VehicleOutHelperService } from './vehicle-out-helper-service';
@Injectable()
export class VHRService {
  constructor(
    private vehicleINRRepository: VehicleINRRepository,
    private vehicleOTRRepository: VehicleOTRRepository,
    private vehicleRepository: VehicleRepository,
    private vehicleStateRepository: VehicleStateRepository,
    private dataSource: DataSource,
    private grnServices: GrnServices,
    private mailerService: MailerService,
    private vehicleOutHelperService: VehicleOutHelperService,
  ) { }

  async createVINR(reqs: VehicleINRDto[]): Promise<CommonResponse> {
    const transactionalEntityManager = this.dataSource;
    console.log(JSON.stringify(reqs), 'reqs');
    try {
      await transactionalEntityManager.transaction(async transactionalEntityManager => {
        for (const req of reqs) {
          const where: any = { refId: String(req.refId), fromType: req.fromType };
          if (req.id) {
            where.id = req.id;
          }
          let entity = await transactionalEntityManager.findOne(VehicleINREntity, {
            where
          });

          if (entity) {
            Object.assign(entity, req);
          } else {
            entity = transactionalEntityManager.create(VehicleINREntity, {
              ...req,
              expectedArrival: new Date().toISOString(),
            });
          }

          const savedEntity = await transactionalEntityManager.save(entity);

          for (const vehicleReq of req.vehicleRecords || []) {
            let vehicleEntity = undefined;
            if (vehicleReq.id)
              await transactionalEntityManager.findOne(VehicleEntity, { where: { id: vehicleReq.id } });

            if (vehicleEntity) {
              Object.assign(vehicleEntity, { ...vehicleReq, vinrId: req.id });
            } else {
              vehicleEntity = transactionalEntityManager.create(VehicleEntity, {
                ...vehicleReq,
                vinrId: savedEntity.id,
                arrivalDateTime: new Date().toISOString()
              });
            }

            const savedVehicleEntity = await transactionalEntityManager.save(vehicleEntity);

            let vehicleStateEntity = await transactionalEntityManager.findOne(VehicleStateEntity, { where: { vid: savedVehicleEntity.id } });

            if (vehicleStateEntity) {
              Object.assign(vehicleStateEntity, { vinrId: savedVehicleEntity.vinrId });
            } else {
              vehicleStateEntity = transactionalEntityManager.create(VehicleStateEntity, {
                id: savedVehicleEntity.id,
                vid: savedVehicleEntity.id,
                vinrId: savedEntity.id,
                vState: TruckStateEnum.OPEN,
                createdAt: new Date(),
                updatedAt: new Date(),
                versionFlag: 1,
              });
            }
            await transactionalEntityManager.save(vehicleStateEntity);
          }

        }
      });

      return new CommonResponse(true, 1, "Data Processed");
    } catch (err) {
      console.error(err);
      return new CommonResponse(false, 0, "Error occurred", null);
    }
  }

  async createVOTR(reqs: VehicleOTRDto[]): Promise<CommonResponse> {
    const transactionalEntityManager = this.dataSource;

    try {
      const vOTREntityToSave: VehicleOTREntity[] = [];
      const vehicleEntitiesToSave: VehicleEntity[] = [];
      const vehicleStateEntitiesToSave: VehicleStateEntity[] = [];

      await transactionalEntityManager.transaction(async transactionalEntityManager => {
        let runningSerial = await transactionalEntityManager.count(VehicleOTREntity);
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        for (const req of reqs) {

          // Find or create VehicleOTREntity
          let votrEntity = await transactionalEntityManager.findOne(VehicleOTREntity, {
            where: [
              { refId: String(req.refId), fromType: req.fromType },
              { id: req.id }
            ]
          });
          if (votrEntity) {
            Object.assign(votrEntity, req);
            votrEntity.gatePassStatus = GatePassStatus.OPEN;
          } else {
            runningSerial++;
            const formatted = String(runningSerial).padStart(5, "0");
            const gatexNumber = `DC${yy}${mm}${dd}${formatted}`;
            votrEntity = transactionalEntityManager.create(VehicleOTREntity, {
              ...req,
              gatexNumber: gatexNumber,
              mailRecipent: req.mailRecipent?.join(','),
              approvelUrl: req.approvelUrl,
              apiMethod: req.apiMethod,
              expectedDeparture: new Date().toISOString(),
            });
          }
          await transactionalEntityManager.save(votrEntity);
          vOTREntityToSave.push(votrEntity);

          // Prepare VehicleEntities with correct votrId
          const vehiclesToSave: VehicleEntity[] = [];
          for (const vehicleReq of req.vehicleRecords || []) {
            let vehicleEntity;

            if (vehicleReq.id) { // only update if id is present
              vehicleEntity = await transactionalEntityManager.findOne(VehicleEntity, { where: { id: vehicleReq.id } });
              if (vehicleEntity) {
                Object.assign(vehicleEntity, { ...vehicleReq, votrId: votrEntity.id });
              }
            }

            if (!vehicleEntity) {
              // always create new if not found or id is missing
              vehicleEntity = transactionalEntityManager.create(VehicleEntity, {
                ...vehicleReq,
                votrId: votrEntity.id,
                departureDateTime: new Date().toISOString()
              });
            }

            vehiclesToSave.push(vehicleEntity);
          }
          await transactionalEntityManager.save(vehiclesToSave);


          // Prepare VehicleStateEntities
          for (const vehicle of vehiclesToSave) {
            let vehicleStateEntity = await transactionalEntityManager.findOne(VehicleStateEntity, { where: { vid: vehicle.id } });

            if (vehicleStateEntity) {
              Object.assign(vehicleStateEntity, { votrId: vehicle.votrId });
            } else {
              vehicleStateEntity = transactionalEntityManager.create(VehicleStateEntity, {
                id: vehicle.id,
                vid: vehicle.id,
                votrId: vehicle.votrId,
                vState: TruckStateEnum.PAUSE,
                createdAt: new Date(),
                updatedAt: new Date(),
                versionFlag: 1,
              });
            }
            vehicleStateEntitiesToSave.push(vehicleStateEntity);
          }

          if (vehicleStateEntitiesToSave.length > 0) {
            await transactionalEntityManager.save(vehicleStateEntitiesToSave);
          }
        }
      });


      const emailAddresses = [reqs.map(req => req.mailRecipent)];
      for (const votr of vOTREntityToSave) {
        for (const email of emailAddresses) {
          const payload = {
            dcId: votr.id,
            refId: votr.refId,
            isAssignable: 'YES',
            emailId: email,
            assignBy: 8,
            status: 'SENT FOR APPROVAL',
            dcNumber: votr.gatexNumber,
            fromUnit: votr.fromType,
            toAddresserName: votr.toType,
            created_user: votr.createdUser,
            purpose: "Sub Contracting",
            gatePassStatus: votr.gatePassStatus
          };
          if (emailAddresses.length) {
            const result = await this.sendDcMailForGatePass(payload);
            if (!result) {
              console.error("Mail failed →", votr.gatexNumber, email);
            }
          }
        }
      }

      return new CommonResponse(true, 1, "Data Processed", {
        votrRecords: vOTREntityToSave,
        vehicleRecords: vehicleEntitiesToSave,
        vehicleStateRecords: vehicleStateEntitiesToSave,
      });
    } catch (err) {
      console.error(err);
      return new CommonResponse(false, 0, err.message, null);
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
              href="${configVariables.APP_GATEX_SERVICE_URL}/api/vhr/approveGatePassById/${dto.refId}"
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
              href="${configVariables.APP_GATEX_SERVICE_URL}/api/vhr/rejectGatePassById/${dto.refId}"
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
      const res = await this.mailerService.sendDcMail(dcDetails);
      return res?.status;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }


  async getVINR(request: RefIdStatusDTO[]): Promise<CommonResponse> {
    try {
      const vinrRecords = await this.vehicleINRRepository.find();
      if (!vinrRecords.length) {
        return new CommonResponse(false, 0, "No records found", []);
      }

      const vehicleRecords = await this.vehicleRepository.find();
      const vehicleStateRecords = await this.vehicleStateRepository.find();

      const filteredVINR = vinrRecords.filter(vinr =>
        request.some(req => vinr.refId === req.refId)
      );

      if (!filteredVINR.length) {
        return new CommonResponse(false, 0, "No matching records found", []);
      }

      const vinrWithVehicles = filteredVINR.map(vinr => {
        const relatedVehicles = vehicleRecords.filter(vehicle =>
          Number(vehicle.vinrId) === Number(vinr.id) &&
          (request.some(req => req.refId === vinr.refId && Number(req.vid) === Number(vehicle.id)) ||
            request.every(req => req.vid === undefined))
        ).map(vehicle => Object.assign({}, vehicle));

        const relatedVehicleIds = relatedVehicles.map(vehicle => Number(vehicle.id));

        const relatedVehicleStates = vehicleStateRecords.filter(vehicleState =>
          (relatedVehicleIds.length > 0 ? relatedVehicleIds.includes(Number(vehicleState.vid)) : true) &&
          request.some(req => req.status === undefined || Number(req.status) === Number(vehicleState.vState))
        );
        return {
          ...vinr,
          vehicleRecords: relatedVehicles,
          vehicleStateRecords: relatedVehicleStates,
        };
      });

      return new CommonResponse(true, 1, "Data Retrieved", vinrWithVehicles);
    } catch (err) {
      console.error(err);
      return new CommonResponse(false, 0, "Error occurred", null);
    }
  }

  async getVOTR(request: RefIdStatusDTO[]): Promise<CommonResponse> {
    try {
      const vOutRecords = await this.vehicleOTRRepository.find();
      if (!vOutRecords.length) {
        return new CommonResponse(false, 0, "No records found", []);
      }

      const vehicleRecords = await this.vehicleRepository.find();
      const vehicleStateRecords = await this.vehicleStateRepository.find();

      const filteredVOTR = vOutRecords.filter(votr =>
        request.some(req => votr.refId === req.refId)
      );

      if (!filteredVOTR.length) {
        return new CommonResponse(false, 0, "No matching records found", []);
      }

      const vinrWithVehicles = filteredVOTR.map(votr => {
        const relatedVehicles = vehicleRecords.filter(vehicle =>
          Number(vehicle.votrId) === Number(votr.id) &&
          (request.some(req => req.refId === votr.refId && Number(req.vid) === Number(vehicle.id)) ||
            request.every(req => req.vid === undefined))
        ).map(vehicle => Object.assign({}, vehicle));

        const relatedVehicleIds = relatedVehicles.map(vehicle => Number(vehicle.id));

        const relatedVehicleStates = vehicleStateRecords.filter(vehicleState =>
          relatedVehicleIds.includes(Number(vehicleState.vid)) &&
          request.some(req => req.status === undefined || Number(req.status) === Number(vehicleState.vState))
        );

        return {
          ...votr,
          vehicleRecords: relatedVehicles,
          vehicleStateRecords: relatedVehicleStates,
        };
      });

      return new CommonResponse(true, 1, "Data Retrieved", vinrWithVehicles);
    } catch (err) {
      console.error(err);
      return new CommonResponse(false, 0, "Error occurred", null);
    }
  }

  async getTruckInfoByTruckId(req: TruckIdReqeust): Promise<CommonResponse> {
    try {
      const vehicleRecords = await this.vehicleRepository.find();
      const truckInfo = vehicleRecords.filter(truck => Number(truck.id) === Number(req.truckId));
      if (truckInfo) {
        return new CommonResponse(true, 1, 'Data Retrived', truckInfo)
      } else {
        return new CommonResponse(false, 0, 'No Data Found')
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateTruckState(req: TruckIdReqeust): Promise<CommonResponse> {
    try {
      const vehicleStateRecords = await this.vehicleStateRepository.update({ id: req.truckId }, { vState: req.state })
      if (vehicleStateRecords) {
        return new CommonResponse(true, 1, 'Data Retrived', vehicleStateRecords)
      } else {
        return new CommonResponse(false, 0, 'No Data Found')
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getVehicleRecordForReferenceId(req: RefIdStatusDTO): Promise<CommonResponse> {
    try {
      const [vehicleINR, vehicleOTR] = await Promise.all([
        this.vehicleINRRepository.findOne({ where: { refId: req.refId } }),
        this.vehicleOTRRepository.findOne({ where: { refId: req.refId } }),
      ]);

      if (!vehicleINR && !vehicleOTR) {
        return new CommonResponse(false, 0, 'No Data Found in INR and OTR Repositories');
      }

      let vehicleINRRecords = [];
      let vehicleOTRRecords = [];

      if (vehicleINR) {
        vehicleINRRecords = await this.vehicleRepository.find({ where: { vinrId: Number(vehicleINR.id) } });
      }

      if (vehicleOTR) {
        vehicleOTRRecords = await this.vehicleRepository.find({ where: { votrId: Number(vehicleOTR.id) } });
      }

      let vehicleINRStateRecords = [];
      let vehicleOTRStateRecords = [];

      if (vehicleINRRecords.length) {
        const vehicleINRIds = vehicleINRRecords.map(vehicle => vehicle.id);
        vehicleINRStateRecords = await this.vehicleStateRepository.find({ where: { vid: In(vehicleINRIds) } });
      }

      if (vehicleOTRRecords.length) {
        const vehicleOTRIds = vehicleOTRRecords.map(vehicle => vehicle.id);
        vehicleOTRStateRecords = await this.vehicleStateRepository.find({ where: { vid: In(vehicleOTRIds) } });
      }

      const responseData = {
        vehicleINR,
        vehicleOTR,
        vehicleINRRecords,
        vehicleOTRRecords,
        vehicleINRStateRecords,
        vehicleOTRStateRecords,
      };

      return new CommonResponse(true, 1, 'Data Retrieved Successfully', responseData);
    } catch (err) {
      console.error('Error retrieving vehicle data:', err);
      return new CommonResponse(false, 0, 'Error fetching vehicle data');
    }
  }

  async getRefIdsByStatus(req: VRStatusDTO): Promise<VRRefIdsResponseModel> {
    console.log(req, 'req');
    const data = await this.vehicleINRRepository.getRefIdsByStatus(req);
    if (data.length == 0) {
      throw new ErrorResponse(0, 'No data found');
    }
    return new VRRefIdsResponseModel(true, 1, 'data retrived', data);
  }

  async getVehicleNotAssignedVINRRequestIds(req: GetVehicleNAInrReqModal): Promise<VRRefIdsResponseModel> {
    const data = await this.vehicleINRRepository.getVehicleNotAssignedVINRRequestIds(req);
    if (data.length == 0) {
      throw new ErrorResponse(0, 'No data found');
    }
    return new VRRefIdsResponseModel(true, 1, 'data retrived', data);
  }

  async addVehicleToVINR(req: ADDVehicleReqModal): Promise<CommonResponse> {
    const reqData = await this.vehicleINRRepository.findOne({ where: { refId: req.refId, fromType: req.fromType } });
    if (!reqData) {
      throw new ErrorResponse(0, 'No Request found with given details');
    }
    for (const vehicle of req.vehicleDetails) {
      let vehicleData = null;
      if (vehicle.id != null) {
        vehicleData = await this.vehicleRepository.findOne({ where: { id: vehicle.id } });
      }
      if (!vehicleData) {
        const vehicleEntity = new VehicleEntity();
        Object.assign(vehicleEntity, vehicle);
        vehicleEntity.vinrId = reqData.id;
        vehicleEntity.vState = 0;
        const savedVehicle = await this.vehicleRepository.save(vehicleEntity);
        const exist = await this.vehicleStateRepository.findOne({ where: { vid: savedVehicle.id, vState: 0 } });
        if (!exist) {
          await this.vehicleStateRepository.save({ vid: savedVehicle.id, vinrId: reqData.id, vState: 0 });
        }
      }
    }
    return new CommonResponse(true, 1, 'data saved successfully');
  }

  async getVehicleDetails(req: ADDVehicleReqModal): Promise<GetVehicleResModel> {
    const reqData = await this.vehicleINRRepository.findOne({ where: { refId: req.refId, fromType: req.fromType } });
    const reqVehicleDetails = [...req.vehicleDetails];
    if (!reqData)
      throw new ErrorResponse(0, 'No Request found with given details');

    let vehicleData = null;
    if (req.vehicleDetails.length > 0) {
      vehicleData = await this.vehicleRepository.find({
        where: { vinrId: reqData.id, id: In(req.vehicleDetails.map(vehicle => vehicle.id)) }
      });
    } else {
      vehicleData = await this.vehicleRepository.find({
        where: { vinrId: reqData.id }
      });
    }
    console.log(vehicleData, 'vehicleData');
    req.vehicleDetails = [];
    for (const vehicle of vehicleData) {
      const history = await this.vehicleStateRepository.find({ where: { vid: vehicle.id } });
      const lastHistory = await this.vehicleStateRepository.findOne({ where: { vid: vehicle.id }, order: { createdAt: 'DESC' } });
      console.log(lastHistory, 'lastHistory');
      const historyRecord = new HistoryRecord();
      const inAt = history.find(history => history.vState == TruckStateEnum.OPEN);
      historyRecord.inAt = inAt?.createdAt ? inAt?.createdAt : null;
      const unloadStartAt = history.find(history => history.vState == TruckStateEnum.UNLOADING);
      historyRecord.unloadStartAt = unloadStartAt?.createdAt ? unloadStartAt?.createdAt : null;
      const unloadPauseAt = history.find(history => history.vState == TruckStateEnum.PAUSE);
      historyRecord.unloadPauseAt = unloadPauseAt?.createdAt ? unloadPauseAt?.createdAt : null;
      const unloadCompleteAt = history.find(history => history.vState == TruckStateEnum.UNLOAD_COMPLETED);
      historyRecord.unloadCompleteAt = unloadCompleteAt?.createdAt ? unloadCompleteAt?.createdAt : null;
      req.vehicleDetails.push(new VehicleModal(vehicle.id, vehicle.vehicleNo, vehicle.dName, vehicle.dContact, vehicle.arrivalDateTime, vehicle.departureDateTime, vehicle.vehicleType, vehicle.inHouseVehicle, vehicle.vinrId, vehicle.votrId, (reqVehicleDetails.length && lastHistory) ? lastHistory.vState : vehicle.vState, historyRecord));
    }
    return new GetVehicleResModel(true, 1, 'data retrived', req);
  }

  async addHistoryRecords(req: ADDHistoryReqModel): Promise<CommonResponse> {
    const findVehicle = await this.vehicleRepository.findOne({ where: { id: req.vehicleId } });
    if (!findVehicle) {
      throw new ErrorResponse(0, 'No vehicle found with given details');
    }
    const vehicleState = new VehicleStateEntity();
    vehicleState.vid = findVehicle.id;
    vehicleState.vinrId = findVehicle.vinrId;
    vehicleState.vState = req.status;
    await this.vehicleStateRepository.save(vehicleState);

    if (req.status == TruckStateEnum.UNLOAD_COMPLETED) {
      const vehicleCount = await this.vehicleRepository.count({ where: { vinrId: findVehicle.vinrId } });
      const vehicleStateCount = await this.vehicleStateRepository.count({ where: { vinrId: findVehicle.vinrId, vState: TruckStateEnum.UNLOAD_COMPLETED } });
      if (vehicleCount == vehicleStateCount) {
        const reqData = await this.vehicleRepository.update({ id: findVehicle.vinrId }, { vState: TruckStateEnum.UNLOAD_COMPLETED });
      }
    }

    return new CommonResponse(true, 1, 'data saved successfully');
  }

  async createVehicle(vehicleDtos: VehicleDto[]): Promise<CommonResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const vehicleInrRecord = await this.dataSource.getRepository(VehicleINREntity).findOne({ select: ['refId', 'refNumber', 'toType'], where: { id: vehicleDtos[0].id } });
    const currentDate = new Date()
    await queryRunner.startTransaction();
    try {
      const vehicleModal: VehicleModal[] = []
      const savedVehicles: VehicleEntity[] = [];
      for (const vehicleDto of vehicleDtos) {
        const entity = new VehicleEntity();
        entity.vinrId = vehicleDto.id;
        entity.vehicleNo = vehicleDto.vehicleNo;
        entity.dName = vehicleDto.dName;
        entity.dContact = vehicleDto.dContact;
        entity.vehicleType = vehicleDto.vehicleType;
        entity.vState = vehicleDto.vState;
        if (vehicleDto.readyToIn !== undefined) {
          entity.arrivalDateTime = currentDate;
        } else if (vehicleDto.readyToSend !== undefined) {
          entity.departureDateTime = currentDate;
          if (vehicleInrRecord.toType === LocationToTypeEnum.WH) {
            const sOut = new SecurityCheckRequest(vehicleDto.createdUser, vehicleDto.unitCode, vehicleDto.companyCode, vehicleDto.userId, vehicleDto.id, vehicleDto.vehicleNo, vehicleDto.dName, vehicleDto.createdUser, vehicleDto.dContact, undefined, currentDate, vehicleDto.id, CheckListStatus.VERIFIED, vehicleDto.vehicleNo, '', 0, 0, '', '')
            await this.grnServices.saveSecurityCheckOut(sOut)
          }
        }
        const savedVehicle = await queryRunner.manager.save(entity);
        savedVehicles.push(savedVehicle);

        const vehStateEntity = new VehicleStateEntity();
        vehStateEntity.vid = savedVehicle.id;
        vehStateEntity.vState = TruckStateEnum.OPEN;
        vehStateEntity.createdAt = currentDate;
        vehStateEntity.updatedAt = currentDate;
        vehStateEntity.versionFlag = 1;
        if (savedVehicle.vinrId) {
          vehStateEntity.vinrId = savedVehicle.vinrId;
          // Update INR vehicle status
          await this.vehicleINRRepository.update({ id: savedVehicle.vinrId }, { reqStatus: 1 }); // Consider using enum/constant for status codes
        } else if (savedVehicle.votrId) {
          vehStateEntity.votrId = savedVehicle.votrId;
          // Update OTR vehicle status
          await this.vehicleOTRRepository.update({ id: savedVehicle.votrId }, { reqStatus: 1 });
        }
        const vModal = new VehicleModal(savedVehicle.id, vehicleDto.vehicleNo, vehicleDto.dName, vehicleDto.dContact, currentDate, currentDate, vehicleDto.vehicleType, true, savedVehicle.vinrId, savedVehicle.votrId, vehicleDto.vState);
        vehicleModal.push(vModal)
        await queryRunner.manager.save(vehStateEntity);
      }
      await queryRunner.commitTransaction();
      if (vehicleInrRecord.toType === LocationToTypeEnum.WH) {
        const vReq = new ADDVehicleReqModal(vehicleInrRecord.refId, vehicleInrRecord.refNumber, LocationFromTypeEnum.WH, vehicleModal, vehicleDtos[0].createdUser, vehicleDtos[0].unitCode, vehicleDtos[0].companyCode, 0)
        await this.grnServices.saveSecurityCheckIn(vReq)
      }
      return new CommonResponse(true, 1, 'Vehicles created successfully', savedVehicles);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error in createVehicle:', error);
      return new CommonResponse(false, 500, 'An error occurred while processing Vehicles');
    } finally {
      await queryRunner.release();
    }
  }

  async getVINRALL(req?: RefIdStatusDTO): Promise<CommonResponse> {
    try {
      const result = await this.vehicleINRRepository.getVINRALL(req)
      if (result) {
        return new CommonResponse(true, 1, "Data Retrieved", result);
      } else {
        return new CommonResponse(false, 0, "Failed to Retrive", []);
      }
    } catch (err) {
      console.error(err);
      return new CommonResponse(false, 0, "Error occurred", null);
    }
  }

  async getVOTRALL(req: RefIdStatusDTO): Promise<CommonResponse> {
    try {
      const result = await this.vehicleOTRRepository.getOTRALL(req)
      if (result) {
        return new CommonResponse(true, 1, "Data Retrieved", result);
      } else {
        return new CommonResponse(false, 0, "Failed to Retrive", []);
      }
    } catch (err) {
      console.error(err);
      return new CommonResponse(false, 0, "Error occurred", null);
    }
  }

  async updateVehicleState(req: TruckIdReqeust): Promise<CommonResponse> {
    try {
      if (req.vinrId) {
        const entity = new VehicleStateEntity();
        entity.vid = req.truckId;
        entity.vinrId = Number(req.vinrId)
        entity.vState = req.state;
        const saveVehicleINRRecord = await this.vehicleStateRepository.save(entity);
        return new CommonResponse(true, 1, 'Data Updated and Saved', saveVehicleINRRecord);
      } else {
        const entity = new VehicleStateEntity();
        entity.vid = req.truckId;
        entity.votrId = Number(req.votrId)
        entity.vState = req.state;
        const saveVehicleOTRecord = await this.vehicleStateRepository.save(entity);
        return new CommonResponse(true, 1, 'Data Updated and Saved', saveVehicleOTRecord);
      }
    } catch (err) {
      console.log(err);
      return new CommonResponse(false, 0, 'Error: ' + err.message);
    }
  }

  //OLD - NOT USING
  /**
   * OLD ENDPOINT CHANGED TO BELOW API(updateDepartureAndStatus)
   * @param req 
   * @returns 
   */
  async updateDepartureAndStatusOld(req: TruckIdReqeust): Promise<string> {
    try {
      // Fetch OTR records for the given votrId
      const otrRecords = await this.vehicleOTRRepository.find({ where: { id: Number(req.votrId) } });

      if (!otrRecords.length) {
        console.log(`No records found for votrId: ${req.votrId}`);
        return 'No OTR records found';
      }

      let updatedDeparture = false;

      // Fetch the vehicle record for the given truckId
      const vehicle = await this.vehicleRepository.findOne({ where: { id: req.truckId } });

      if (vehicle) {
        vehicle.departureDateTime = new Date();
        await this.vehicleRepository.save(vehicle);
        updatedDeparture = true;
      } else {
        console.log(`No vehicle found for vehicleId: ${req.truckId}`);
        return 'No vehicle found';
      }

      // Fetch all vehicles related to the given votrId
      const relatedVehicles = await this.vehicleRepository.find({ where: { votrId: Number(req.votrId) } });

      // Check if all vehicles have a departureDateTime
      const allDeparted = relatedVehicles.every(vehicle => vehicle.departureDateTime !== null);

      // If all related vehicles have departureDateTime, update reqStatus = 1 in vehicleOTRRepository
      if (allDeparted) {
        await this.vehicleOTRRepository.update({ id: Number(req.votrId) }, { reqStatus: 1 });
        console.log(`Updated reqStatus to 1 for votrId: ${req.votrId}`);
      }

      return updatedDeparture ? 'Departure updated successfully' : 'No vehicle updated';
    } catch (error) {
      console.error('Error updating records:', error);
      throw new Error('Failed to update departure time and request status.');
    }
  }

  async updateDepartureAndStatus(req: TruckIdReqeust): Promise<CommonResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!req.truckId || !req.votrId) {
        throw new ErrorResponse(0, "Truck Id and Votr Id are Mandatory in the request")
      }
      const otrRecord = await queryRunner.manager.findOne(VehicleOTREntity, { where: { id: Number(req.votrId) } });
      if (!otrRecord) {
        throw new ErrorResponse(0, 'No Out Request records found');
      }
      if (otrRecord.reqStatus == ReqStatus.DONE) {
        throw new ErrorResponse(0, "The vehicle out request is already done")
      }
      const vehicle = await queryRunner.manager.findOne(VehicleEntity, { where: { id: req.truckId }, });
      if (!vehicle) {
        throw new ErrorResponse(0, `No vehicle found for vehicleId: ${req.truckId}`);
      }
      vehicle.departureDateTime = new Date();
      await queryRunner.manager.save(VehicleEntity, vehicle);
      //Check if all vehicles related to this votrId have departed
      const relatedVehicles = await queryRunner.manager.find(VehicleEntity, { where: { votrId: Number(req.votrId) } });
      const allDeparted = relatedVehicles.every(v => v.departureDateTime !== null);

      // If all vehicles departed, update OTR status
      if (allDeparted) {
        otrRecord.reqStatus = ReqStatus.DONE;
        otrRecord.gatePassStatus = GatePassStatus.APPROVE;
        await queryRunner.manager.save(VehicleOTREntity, otrRecord);
      }

      await queryRunner.commitTransaction();

      // Call external System to update the gateout status after commit
      try {
        await this.vehicleOutHelperService.updateVehicleOutStatusToExternalSystem(req);
      } catch (extError) {
        throw extError;
      }

      return new CommonResponse(true, 1, 'Departure updated successfully');
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async getAllINVehicleByVehReq(req?: RefIdStatusDTO): Promise<CommonResponse> {
    try {
      const result = await this.vehicleINRRepository.getAllINVehicleByVehReq(req)
      if (result && typeof result === "object" && "status" in result) {
        return result;
      }
      return new CommonResponse(false, 0, "No records found", []);
    } catch (err) {
      console.error(err);
      return new CommonResponse(false, 0, "Error occurred", null);
    }
  }

  //NOT USING
  /**
   * OLD ENDPOINT CHANGED AND OPTIMIZED TO BELOW
   * @param req 
   * @returns 
   */
  async getAllOUTVehicleByVehReqOld(req?: RefIdStatusDTO): Promise<CommonResponse> {
    try {
      const result = await this.vehicleOTRRepository.getAllOUTVehicleByVehReq(req)
      if (result && typeof result === "object" && "status" in result) {
        return result;
      }
      return new CommonResponse(false, 0, "No records found", []);
    } catch (err) {
      console.error(err);
      return new CommonResponse(false, 0, "Error occurred", null);
    }
  }


  async getAllOUTVehicleByVehReq(req?: VehicleReqDTO): Promise<CommonResponse> {
    try {
      if (!req.vehicleNo) {
        throw new ErrorResponse(0, "vehicleNo is required")
      }
      const today = new Date().toISOString().split("T")[0];
      const vehicleRecords = await this.vehicleRepository.find({ where: { vehicleNo: req.vehicleNo, departureDateTime: Raw(alias => `DATE(${alias}) = :today`, { today }) } });
      if (vehicleRecords.length === 0) {
        return new CommonResponse(false, 1, "No record found for the given vehicle number with today's Departure date");
      }
      const votrIds = [...new Set(vehicleRecords?.map(v => Number(v.votrId)))]?.filter(id => id);
      if (votrIds.length === 0) {
        return new CommonResponse(false, 1, "No associated OTR records found for this vehicle");
      }
      const vehicleOTRRecords = await this.vehicleOTRRepository.find({ where: { id: In(votrIds), reqStatus: ReqStatus.OPEN } });
      const vehicleIds = vehicleRecords.map(v => v.id);
      const vehicleStateRecords = await this.vehicleStateRepository.find({ where: { vid: In(vehicleIds) } });
      const vehicleOTR = [];
      for (const rec of vehicleOTRRecords) {
        const vehicleRecordsToSave = [];
        const matchedVehicles = vehicleRecords.filter(r => Number(r.votrId) === Number(rec.id));
        for (const vehicleData of matchedVehicles) {
          const vehState = vehicleStateRecords.filter(rr => Number(rr.vid) === Number(vehicleData.id));
          const finalVehicleStateRecords = vehState.map(state => ({
            ...state,
            vehicleTypeEnum: TruckStateEnum[state.vState as unknown as keyof typeof TruckStateEnum] || "UNKNOWN"
          }));
          vehicleRecordsToSave.push({ ...vehicleData, vehicleStateRecords: finalVehicleStateRecords });
        }
        vehicleOTR.push({ ...rec, vehicleRecords: vehicleRecordsToSave });
      }

      const finalVehicleOTRRecords = vehicleOTR.map(votr => ({
        ...votr,
        reqStatusData: votr.reqStatus == ReqStatus.OPEN ? "OPEN" : "DONE",
        readyToSendData: votr.readyToSend == 1 ? "IN" : "OUT"
      }));

      return new CommonResponse(true, 1, "Data Retrieved Successfully", finalVehicleOTRRecords);

    } catch (err) {
      throw err;
    }
  }

  async updateWeightByVINRid(req: any): Promise<CommonResponse> {
    try {
      let result = [];
      for (const rec of req) {
        const data = await this.vehicleRepository.update({ id: rec.vId }, { updatedWeight: rec.updatedWeight, vState: TruckStateEnum.CLOSED });
        const vehState = await this.vehicleStateRepository.update({ vid: rec.vId }, { vState: TruckStateEnum.CLOSED })

        if (vehState) {
          const vehEnId = await this.vehicleRepository.findOne({ where: { id: rec.vId } }); // Find id in Veh EN DB
          if (vehEnId) {
            const findINRId = await this.vehicleRepository.find({ where: { vinrId: vehEnId.vinrId } })  // Find VINR in Veh EN 
            const allClosed = findINRId.every(v => v.vState === TruckStateEnum.CLOSED);
            if (allClosed) {
              // Then Update if all are CLOSED
              await this.vehicleINRRepository.update({ id: findINRId[0]?.vinrId }, { reqStatus: ReqStatus.DONE });
            }
          }
        }
        result.push(data)
      }
      if (result.length > 0) {
        return new CommonResponse(true, 2001, 'Weight Updated Successfully', result)
      } else {
        return new CommonResponse(false, 2000, 'Failed to Update Weight', [])
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateVehicleStatusByRefIdAndVehicleNo(req: VehicleStatusDTO): Promise<CommonResponse> {
    try {
      let vehEnQuery = await this.vehicleRepository.findOne({ where: { vinrId: req.refId, vehicleNo: req.vehicleNumber } });

      if (!vehEnQuery) {
        return new CommonResponse(false, 0, `No vehicle found for RefId - ${req.refId}, Vehicle Number - ${req.vehicleNumber}`)
      } else {
        let vehStateQuery = await this.vehicleStateRepository.findOne({ where: { vid: vehEnQuery.id } })
        if (vehStateQuery.vState !== TruckStateEnum.OPEN) {
          return new CommonResponse(false, 0, `Requested Vehicle Number - ${req.vehicleNumber} Truck Status is not in OPEN`)
        } else {
          await this.vehicleStateRepository.update({ vid: vehEnQuery.id }, { vState: TruckStateEnum.RETURN, remarks: req.remarks })
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  async approveGatePassById(refId: string): Promise<CommonResponse> {
    try {
      const votrDetails = await this.vehicleOTRRepository.findOne({ where: { refId: refId } });
      if (!votrDetails) {
        return new CommonResponse(false, 0, 'Gatepass record not found');
      }
      const approvelUrl = votrDetails.approvelUrl;
      const updateResult = await this.vehicleOTRRepository.update({ refId: refId }, { gatePassStatus: GatePassStatus.APPROVE });
      const reqPayload = new RefIdReq(refId)
      if (updateResult.affected && updateResult.affected > 0) {
        //external system call
        await AxiosInstance.post(approvelUrl, reqPayload);
        return new CommonResponse(true, 1, 'Gatepass Approved', updateResult);
      } else {
        return new CommonResponse(false, 0, 'No records found to update');
      }
    } catch (err) {
      throw err
    }
  }

  async rejectGatePassById(refId: string): Promise<CommonResponse> {
    try {
      const votrDetails = await this.vehicleOTRRepository.findOne({ where: { refId: refId } });
      if (!votrDetails) {
        return new CommonResponse(false, 0, 'Gatepass record not found');
      }
      const approvelUrl = votrDetails.approvelUrl;
      const updateResult = await this.vehicleOTRRepository.update({ refId: refId }, { gatePassStatus: GatePassStatus.REJECT });
      const reqPayload = new RefIdReq(refId)
      if (updateResult.affected && updateResult.affected > 0) {
        //call to external system
        await AxiosInstance.post(approvelUrl, reqPayload);
        return new CommonResponse(true, 1, 'Gatepass Rejected', updateResult);
      } else {
        return new CommonResponse(false, 0, 'No records found to update');
      }
    } catch (err) {
      return new CommonResponse(false, 500, 'Error updating status', err?.message || err);
    }
  }


}









