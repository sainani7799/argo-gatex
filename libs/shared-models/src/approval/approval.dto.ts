export class ApprovedUserDto {
    approvedId: number;
    approvalUserName: string;
    emailId:string;
    approvedImageName : string;
    approvedImagePath : string
    isActive: boolean;
    createdAt : Date | any;
    createdUser : string;
    versionFlag : number;

    constructor(
    approvedId: number,
    approvalUserName: string,
    emailId:string,
    approvedImageName : string,
    approvedImagePath : string,
    isActive: boolean,
    createdAt : Date | any,
    createdUser : string,
    versionFlag : number,
    ){
        this.approvedId = approvedId
        this.approvalUserName = approvalUserName
        this.emailId = emailId
        this.approvedImageName = approvedImageName
        this.approvedImagePath = approvedImagePath
        this.isActive = isActive
        this.createdAt = createdAt
        this.createdUser = createdUser
        this.versionFlag = versionFlag
    }
}



