import { Injectable } from "@nestjs/common";
import { ItemEntityRepository } from "./repository/item.repository";
import { CreateItemDto } from "./dto/item.dto";
import { CommonResponse } from "libs/shared-models/src/common";
import { ItemEntity } from "./entity/item.entity";
import { itemCode, itemId } from "libs/shared-models";
import { Raw } from "typeorm";
import { itemsAdapter } from "./dto/item.adapter";

@Injectable()
export class ItemService {
    constructor(
        private itemRepo: ItemEntityRepository,
        private itemsAdapter: itemsAdapter,

    ) { }



    async getItemWithoutRelations(itemCode: string): Promise<ItemEntity> {
        const itemResponse = await this.itemRepo.findOne({
            where: { itemCode: Raw(alias => `item_code = '${itemCode}'`) },
        });
        if (itemResponse) {
            return itemResponse;
        }
        else {
            return null;
        }
    }


    async createItem(itemDto: CreateItemDto, isUpdate: boolean): Promise<CommonResponse> {
        console.log('isUpdate============', isUpdate)
        try {
            let previousValue
            const itemsDtos: CreateItemDto[] = [];

            if (!isUpdate) {

                const itemEntity = await this.getItemWithoutRelations(itemDto.itemCode);
                if (itemEntity) {
                    console.log(itemEntity, '------')
                    throw new CommonResponse(false, 11104, 'item Entity already exists');
                }
            }
            else {
                const certificatePrevious = await this.itemRepo.findOne({ where: { itemCode: itemDto.itemCode } })
                previousValue = (certificatePrevious.itemCode)
                const addressEntity = await this.getItemWithoutRelations(itemDto.itemCode);
                if (addressEntity) {
                    if (addressEntity.itemCode != itemDto.itemCode) {
                        throw new CommonResponse(false, 11104, 'Address already exists');
                    }
                }
            }
            const convertedAddressEntity: ItemEntity = this.itemsAdapter.convertDtoToEntity(itemDto, isUpdate);

            console.log(convertedAddressEntity);
            const savedItemsEntity: ItemEntity = await this.itemRepo.save(convertedAddressEntity);
            const savedHeadDto: CreateItemDto = this.itemsAdapter.convertEntityToDto(savedItemsEntity);
            itemsDtos.push(savedItemsEntity)
            console.log(savedItemsEntity, 'saved');
            if (savedItemsEntity) {
                const presentValue = itemDto.itemCode;
                //generating resposnse
                const response = new CommonResponse(true, 1, isUpdate ? 'Item Updated Successfully' : 'Item created Successfully')
                const name = isUpdate ? 'updated' : 'created'
                const displayValue = isUpdate ? 'Item Updated Successfully' : 'Item Created Successfully'
                const userName = isUpdate ? savedHeadDto.updatedUser : savedHeadDto.createdUser;
                console.log(response, '9999999999999999');
                return response;
            } else {
                throw new CommonResponse(false, 11106, 'Item saved but issue while transforming into DTO');
            }
        } catch (error) {
            return error;
        }
    }

    async activateOrDeactivateItem(req: CreateItemDto): Promise<CommonResponse> {
        try {
            const itemExists = await this.getItemsById(req.itemId);
            if (itemExists) {
                if (!itemExists) {
                    throw new CommonResponse(false, 10113, 'Someone updated the current Item information.Refresh and try again');
                } else {

                    const itemStatus = await this.itemRepo.update(
                        { itemId: req.itemId },
                        { isActive: req.isActive, updatedUser: req.updatedUser });

                    if (itemExists.isActive) {
                        if (itemStatus.affected) {
                            const ProfitResponse: CommonResponse = new CommonResponse(true, 10115, 'item  is de-activated successfully');
                            return ProfitResponse;
                        } else {
                            throw new CommonResponse(false, 10111, 'item is already deactivated');
                        }
                    } else {
                        if (itemStatus.affected) {
                            const ProfitResponse: CommonResponse = new CommonResponse(true, 10114, 'Item is activated successfully');
                            return ProfitResponse;
                        } else {
                            throw new CommonResponse(false, 10112, 'Item  is already  activated');
                        }
                    }
                }
            } else {
                throw new CommonResponse(false, 99998, 'No Records Found');
            }
        } catch (err) {
            return err;
        }
    }

    async getAllItems(): Promise<CommonResponse> {
        try {
            const data = await this.itemRepo.find()
            return await new CommonResponse(true, 111, 'Data Retrieved successfully', data)
        } catch (error) {
            console.log(error)
        }
    }
    async getAllItemsByCode(req: itemCode): Promise<CommonResponse> {
        try {
            const query = `select item_id AS itemId, item_code AS itemCode ,item_name AS itemName,description ,uom FROM shahi_items where item_code = '${req.itemCode}'`
            const data = await this.itemRepo.query(query)
            return await new CommonResponse(true, 111, 'Data Retrieved successfully', data)
        } catch (error) {
            console.log(error)
        }
    }

    async getItemsById(itemId: number): Promise<ItemEntity> {
        //  console.log(employeeId);
        const Response = await this.itemRepo.findOne({
            where: { itemId: itemId },
        });
        // console.log(employeeResponse);
        if (Response) {
            return Response;
        } else {
            return null;
        }
    }
}