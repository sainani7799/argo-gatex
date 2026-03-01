export class BuyerTeameDto {
    buyerTeamId:number;
    buyerTeam: string;
    createdUser: string;
    updatedUser?:string;
    isActive?:boolean;
    constructor(buyerTeamId:number,buyerTeam: string, createdUser: string,updatedUser?:string,isActive?:boolean) {
        this.buyerTeamId =buyerTeamId;
        this.buyerTeam = buyerTeam;
        this.createdUser = createdUser;
        this.updatedUser = updatedUser;
        this.isActive = isActive;
    }
}