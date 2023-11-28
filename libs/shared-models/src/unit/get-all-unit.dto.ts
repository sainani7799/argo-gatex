export class GetAllUnitDto {
    id: number;
    unitName: string;
    isActive: boolean;
    versionFlag: number;
    constructor(
        id: number,
        unitName: string,
        isActive: boolean,
        versionFlag: number,
    ) {
        this.id = id
        this.unitName = unitName;
        this.isActive = isActive;
        this.versionFlag = versionFlag;
    }
}