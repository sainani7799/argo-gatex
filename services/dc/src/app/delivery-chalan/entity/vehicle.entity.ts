import { VehicleTypeEnum } from "libs/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('vehicle_en')
export class VehicleEntity {

    @PrimaryGeneratedColumn("increment", { name: 'id' })
    id: bigint;

    @Column('varchar', {
        name: 'vehicle_no',
        length: 15,
        nullable: true,
    })
    vehicleNo: string;

    @Column('varchar', {
        name: 'd_name',
        length: 30,
        nullable: true
    })
    dName: string;

    @Column('varchar', {
        name: 'd_contact',
        length: 15,
        nullable: true
    })
    dContact: string;

    @Column('datetime', {
        name: 'arrival_datetime',
        nullable: true
    })
    arrivalDateTime: Date;

    @Column('datetime', {
        name: 'departure_datetime',
        nullable: true
    })
    departureDateTime: Date;

    @Column('enum', {
        name: 'vehicle_type',
        nullable: true,
        enum: VehicleTypeEnum
    })
    vehicleType: VehicleTypeEnum;

    @Column('boolean', {
        name: 'in_house_vehicle',
        nullable: true
    })
    inHouseVehicle: boolean;

    @Column('bigint', {
        name: 'vinr_id',
        nullable: true
    })
    vinrId: bigint;

    @Column('bigint', {
        name: 'votr_id',
        nullable: true
    })
    votrId: bigint;

    @Column("boolean", {
        nullable: false,
        default: true,
        name: "is_active"
    })
    isActive: boolean;

    @CreateDateColumn({
        name: "created_at",
        type: "datetime"
    })
    createdAt: Date;

    @Column("varchar", {
        nullable: true,
        name: "created_user"
    })
    createdUser: string | null;

    @UpdateDateColumn({
        name: "updated_at",
        type: 'datetime'
    })
    updatedAt: Date;

    @Column("varchar", {
        nullable: true,
        name: "updated_user"
    })
    updatedUser: string | null;

    @VersionColumn({
        default: 1,
        name: "version_flag"
    })
    versionFlag: number;

}
