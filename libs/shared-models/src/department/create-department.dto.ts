export class CreateDepartmentDto {
    id: number;
    departmentName: string;
    departemntCode: number;
    versionFlag: number;
    constructor(
        id: number,
        departmentName: string,
        departemntCode: number,
        versionFlag: number,
    ) {
        this.id = id
        this.departmentName = departmentName;
        this.departemntCode = departemntCode;
        this.versionFlag = versionFlag;
    }
}