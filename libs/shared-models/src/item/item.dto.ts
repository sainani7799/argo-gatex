export class ItemDto {
    itemId:number;
    itemCode: string;
    itemName: string;
    description: string;
    uom: string;
    createdUser: string;
    updatedUser?:string;
    isActive: boolean;
    constructor( itemId:number, itemCode: string, itemName: string, description: string, uom: string, createdUser: string, updatedUser?:string,isActive?: boolean){
            this.itemId = itemId;
            this.itemCode = itemCode;
            this.itemName = itemName;
            this.description = description;
            this.uom = uom;
            this.createdUser = createdUser;
            this.updatedUser = updatedUser;
            this.isActive = isActive
        }
}

export class itemCode{
    itemCode:string
}

export class itemId{
    itemId:number
}