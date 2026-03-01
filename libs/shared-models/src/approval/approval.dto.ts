export class ApprovedUserDto {
    approvedId: number;
    approvedUserName: number;
    emailId:string;
    isActive: boolean;
    createdUser : string;
    versionFlag : number;
    buyersTeam : string;
    sigImageName ?: string;
    signPath ?: string;

    constructor(
    approvedId: number,
    approvedUserName: number,
    emailId:string,
    isActive: boolean,
    createdUser : string,
    versionFlag : number,
    buyersTeam : string,
    sigImageName ?: string,
    signPath ?: string,
    ){
        this.approvedId = approvedId
        this.approvedUserName = approvedUserName
        this.emailId = emailId
        this.sigImageName = sigImageName
        this.signPath = signPath
        this.isActive = isActive
        this.createdUser = createdUser
        this.versionFlag = versionFlag
        this.buyersTeam = buyersTeam
    }
}



