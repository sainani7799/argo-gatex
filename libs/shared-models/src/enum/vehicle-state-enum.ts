export enum TruckStateEnum {
    OPEN = 0,
    LOADING = 1,
    UNLOADING = 2,
    PAUSE = 3,
    LOAD_COMPLETED = 4,
    UNLOAD_COMPLETED = 5
}

export enum VehilceRequestTypeEnum {
    IN = 'IN',
    OUT = 'OUT'
}

export class RefIdStatusRequest {
    refId: string;
    status: number[];
    vrType: VehilceRequestTypeEnum;
}