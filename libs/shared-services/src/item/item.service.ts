import { ItemDto, itemCode } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { AxiosRequestConfig } from "axios";

export class ItemService extends CommonAxiosServicePms {
    private ItemController = '/item-controller';

    async createItem(createDto: ItemDto): Promise<any> {
        return await this.axiosPostCall(this.ItemController +'/createItem', createDto, );
    }

    async getAllItems(): Promise<any> {
        return await this.axiosGetCall(this.ItemController + '/getAllItems')
    }

    async getAllItemsByCode(req:itemCode): Promise<any> {
        return await this.axiosPostCall(this.ItemController + '/getAllItemsByCode',req)
    }
}