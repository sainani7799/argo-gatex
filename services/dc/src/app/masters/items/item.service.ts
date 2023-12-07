import { Injectable } from "@nestjs/common";
import { ItemEntityRepository } from "./repository/item.repository";
import { CreateItemDto } from "./dto/item.dto";
import { CommonResponse } from "libs/shared-models/src/common";
import { AppDataSource } from "../../app-data-source";
import { ItemEntity } from "./entity/item.entity";
import { itemCode } from "libs/shared-models";

@Injectable()
export class ItemService {
  constructor(
    private itemRepo: ItemEntityRepository,
    
  ) { }


    async createItem(dto: CreateItemDto | CreateItemDto[]): Promise<CommonResponse> {
        try {
            const item = Array.isArray(dto) ? dto : [dto];
            for (const obj of item) {
                const existedItem = await AppDataSource.getRepository(ItemEntity).findOne({ where: { itemCode: obj.itemCode } })
                if (existedItem) {
                    return new CommonResponse(false, 0, "Item code already existed in this unit", [])
                } else {
                    for (const obj of item) {
                        const entity = new ItemEntity()
                        entity.itemId = obj.itemId
                        entity.itemCode = obj.itemCode
                        entity.itemName = obj.itemName
                        entity.description = obj.description
                        entity.uom = obj.uom
                        entity.createdUser = obj.createdUser
                        const create = await AppDataSource.getRepository(ItemEntity).save(entity)
                        return await new CommonResponse(true, 111, 'Item created successfully', create)
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getAllItems():Promise<CommonResponse>{
        try{
            const data = await AppDataSource.getRepository(ItemEntity).find()
            return await new CommonResponse(true, 111, 'Data Retrieved successfully', data)
        }catch(error){
            console.log(error)
        }
    }
    async getAllItemsByCode(req:itemCode):Promise<CommonResponse>{
        try{
            const query =`select item_id AS itemId, item_code AS itemCode ,item_name AS itemName,description ,uom FROM shahi_items where item_code = '${req.itemCode}'`
            const data = await AppDataSource.getRepository(ItemEntity).query(query)
            return await new CommonResponse(true, 111, 'Data Retrieved successfully', data)
        }catch(error){
            console.log(error)
        }
    }
}