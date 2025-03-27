import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { AcceptReq, ADDVehicleReqModal, DcEmailModel, DcIdReq, DcReportReq, GetVehicleNAInrReqModal, MessageParameters, ReceivedDcReq, RejectDcReq, SecurityCheckReq, TruckStateEnum, UnitReq, VRRefIdsResponseModel } from 'libs/shared-models';
import { CommonRequestAttrs, CommonResponse } from 'libs/shared-models/src/common';
import { EmailService, WhatsAppNotificationService } from 'libs/shared-services';
import { DataSource, In, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { UnitRepository } from '../masters/branch/repo/unit-repo';
import { DcAdapter } from './adapter/dc.adapter';
import { DcDto } from './dto/dc.dto';
import { RefIdStatusDTO } from './dto/ref-id-status-dto';
import { TruckIdReqeust } from './dto/truck-id-dto';
import { VehicleINRDto } from './dto/vehicle-inr-dto';
import { VehicleOTRDto } from './dto/vehicle-out.dto';
import { VRStatusDTO } from './dto/vr-status-req.dto';
import { DcEntity } from './entity/dc.entity';
import { VehicleEntity } from './entity/vehicle-en.entity';
import { VehicleINREntity } from './entity/vehicle-inr.entity';
import { VehicleOTREntity } from './entity/vehicle-otr.entity';
import { VehicleStateEntity } from './entity/vehicle-state.entity';
import { DcItemEntityRepository } from './repository/dc-items.repo';
import { DcEntityRepository } from './repository/dc-repository';
import { VehicleINRRepository } from './repository/vehicle-inr.repository';
import { VehicleRepository } from './repository/vehicle.repository';
import { VehicleOTRRepository } from './repository/vehicle-otr.repository';
import { ErrorResponse } from 'libs/backend-utils/src/lib/libs/global-res-object';
import { VehicleDto } from './dto/vehicle-en.dto';
import { VehicleStateRepository } from './repository/vehicle-state.repo';

@Injectable()
export class VHRService {
  constructor(
    private vehicleINRRepository: VehicleINRRepository,
    private vehicleOTRRepository: VehicleOTRRepository,
    private vehicleRepository: VehicleRepository,
    private vehicleStateRepository: VehicleStateRepository,
    private dataSource: DataSource
  ) { }

  async createVINR(reqs: VehicleINRDto[]): Promise<CommonResponse> {
    const transactionalEntityManager = this.dataSource;
    try {
      const vINTEntityToSave: VehicleINREntity[] = [];
      const vehicleEntitiesToSave: VehicleEntity[] = [];
      const vehicleStateEntitiesToSave: VehicleStateEntity[] = [];

      await transactionalEntityManager.transaction(async transactionalEntityManager => {
        for (const req of reqs) {
          let entity = await transactionalEntityManager.findOne(VehicleINREntity, { where: { id: req.id } });

          if (entity) {
            Object.assign(entity, req);
          } else {
            entity = transactionalEntityManager.create(VehicleINREntity, {
              ...req,
              expectedArrival: new Date().toISOString(),
            });
          }
          vINTEntityToSave.push(entity);

          const vehiclesToSave: VehicleEntity[] = [];

          for (const vehicleReq of req.vehicleRecords || []) {
            let vehicleEntity = await transactionalEntityManager.findOne(VehicleEntity, { where: { id: vehicleReq.id } });

            if (vehicleEntity) {
              Object.assign(vehicleEntity, { ...vehicleReq, votrId: req.id });
            } else {
              vehicleEntity = transactionalEntityManager.create(VehicleEntity, {
                ...vehicleReq,
                votrId: req.id,
                arrivalDateTime: new Date().toISOString()
              });
            }
            vehiclesToSave.push(vehicleEntity);
          }
          if (vehiclesToSave.length > 0) {
            vehicleEntitiesToSave.push(...vehiclesToSave);
          }

          for (const vehicle of vehiclesToSave) {
            let vehicleStateEntity = await transactionalEntityManager.findOne(VehicleStateEntity, { where: { vid: vehicle.id } });

            if (vehicleStateEntity) {
              Object.assign(vehicleStateEntity, { vinrId: vehicle.vinrId });
            } else {
              vehicleStateEntity = transactionalEntityManager.create(VehicleStateEntity, {
                id: vehicle.id,
                vid: vehicle.id,
                vinrId: vehicle.vinrId,
                vState: TruckStateEnum.OPEN,
                createdAt: new Date(),
                updatedAt: new Date(),
                versionFlag: 1,
              });
            }
            vehicleStateEntitiesToSave.push(vehicleStateEntity);
          }
        }

        await transactionalEntityManager.save(vINTEntityToSave);
        await transactionalEntityManager.save(vehicleEntitiesToSave);
        await transactionalEntityManager.save(vehicleStateEntitiesToSave);
      });

      return new CommonResponse(true, 1, "Data Processed", {
        vinrRecords: vINTEntityToSave,
        vehicleRecords: vehicleEntitiesToSave,
        vehicleStateRecords: vehicleStateEntitiesToSave,
      });
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
        for (const req of reqs) {
          let entity = await transactionalEntityManager.findOne(VehicleOTREntity, { where: { id: req.id } });

          if (entity) {
            Object.assign(entity, req);
          } else {
            entity = transactionalEntityManager.create(VehicleOTREntity, {
              ...req,
              expectedDeparture: new Date().toISOString(),
            });
          }
          vOTREntityToSave.push(entity);

          const vehiclesToSave: VehicleEntity[] = [];

          for (const vehicleReq of req.vehicleRecords || []) {
            let vehicleEntity = await transactionalEntityManager.findOne(VehicleEntity, { where: { id: vehicleReq.id } });

            if (vehicleEntity) {
              Object.assign(vehicleEntity, { ...vehicleReq, votrId: req.id });
            } else {
              vehicleEntity = transactionalEntityManager.create(VehicleEntity, {
                ...vehicleReq,
                votrId: req.id,
                departureDateTime: new Date().toISOString()
              });
            }
            vehiclesToSave.push(vehicleEntity);
          }
          if (vehiclesToSave.length > 0) {
            vehicleEntitiesToSave.push(...vehiclesToSave);
          }

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
        }

        await transactionalEntityManager.save(vOTREntityToSave);
        await transactionalEntityManager.save(vehicleEntitiesToSave);
        await transactionalEntityManager.save(vehicleStateEntitiesToSave);
      });

      return new CommonResponse(true, 1, "Data Processed", {
        votrRecords: vOTREntityToSave,
        vehicleRecords: vehicleEntitiesToSave,
        vehicleStateRecords: vehicleStateEntitiesToSave,
      });
    } catch (err) {
      console.error(err);
      return new CommonResponse(false, 0, "Error occurred", null);
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
      const vehicleData = await this.vehicleRepository.findOne({ where: { id: vehicle.id } });
      if (!vehicleData) {
        const vehicleEntity = new VehicleEntity();
        Object.assign(vehicleEntity, vehicle);
        vehicleEntity.vinrId = reqData.id;
        vehicleEntity.vState = 0;
        await this.vehicleRepository.save(vehicleEntity);
      }
    }
    return new CommonResponse(true, 1, 'data saved successfully');
  }

  async createVehicle(vehicleDtos: VehicleDto[]): Promise<CommonResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedVehicles: VehicleEntity[] = [];
      for (const vehicleDto of vehicleDtos) {
        const entity = new VehicleEntity();
        if (vehicleDto.readyToIn !== undefined) {
          entity.vinrId = vehicleDto.id;
          entity.vehicleNo = vehicleDto.vehicleNo;
          entity.dName = vehicleDto.dName;
          entity.dContact = vehicleDto.dContact;
          entity.arrivalDateTime = new Date();
          entity.vState = vehicleDto.vState;
          entity.vehicleType = vehicleDto.vehicleType;
        } else if (vehicleDto.readyToSend !== undefined) {
          entity.votrId = vehicleDto.id;
          entity.vehicleNo = vehicleDto.vehicleNo;
          entity.dName = vehicleDto.dName;
          entity.dContact = vehicleDto.dContact;
          entity.departureDateTime = new Date();
          entity.vState = vehicleDto.vState;
          entity.vehicleType = vehicleDto.vehicleType;
        }
        const savedVehicle = await queryRunner.manager.save(entity);
        savedVehicles.push(savedVehicle);

        const vehStateEntity = new VehicleStateEntity();
        vehStateEntity.vid = savedVehicle.id;
        vehStateEntity.vState = TruckStateEnum.OPEN;
        vehStateEntity.createdAt = new Date();
        vehStateEntity.updatedAt = new Date();
        vehStateEntity.versionFlag = 1;
        if (savedVehicle.vinrId) {
          vehStateEntity.vinrId = savedVehicle.vinrId;
          // Update INR vehicle status
          await this.vehicleINRRepository.update(
              { id: savedVehicle.vinrId },
              { reqStatus: 1 } // Consider using enum/constant for status codes
          );
      } else if (savedVehicle.votrId) {
          vehStateEntity.votrId = savedVehicle.votrId;
          // Update OTR vehicle status
          await this.vehicleOTRRepository.update(
              { id: savedVehicle.votrId },
              { reqStatus: 1 }
          );
      }

        await queryRunner.manager.save(vehStateEntity);
      }
      await queryRunner.commitTransaction();

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


    async updateDepartureAndStatus(req: TruckIdReqeust): Promise<string> {
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
    
    
    
  

}









