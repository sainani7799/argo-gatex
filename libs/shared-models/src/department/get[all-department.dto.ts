export class GetAllDepartmentDto {
    id: number;
    departmentName: string;
    departemntCode: number;
    isActive: boolean;
    versionFlag: number;
    constructor(
        id: number,
        departmentName: string,
        departemntCode: number,
        isActive: boolean,
        versionFlag: number,
    ) {
        this.id = id
        this.departmentName = departmentName;
        this.departemntCode = departemntCode;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }
}