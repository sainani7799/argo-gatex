export class ItemsReq{
    itemId:number;
    itemCode:string;
    itemName:string;
    description:string;
    uom:string;
    qty:number;
    rate:number;
    amount:number;
    constructor( itemId:number, itemCode:string, itemName:string, description:string, uom:string, qty:number, rate:number, amount:number,){
        this.itemId = itemId;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.description = description;
        this.uom =uom;
        this.qty = qty;
        this.rate = rate;
        this.amount = amount
    }
}