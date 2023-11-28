export class CreateUnitDto {
    id: number;
    unitName: string;
    versionFlag: number;
    constructor(
        id: number,
        unitName: string,
        versionFlag: number,
    ) {
        this.id = id
        this.unitName = unitName;
        this.versionFlag = versionFlag;
    }
}