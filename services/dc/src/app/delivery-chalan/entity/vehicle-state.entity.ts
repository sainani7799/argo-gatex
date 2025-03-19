import { TruckStateEnum } from "libs/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('vehicle_state')
export class VehicleStateEntity {

    @PrimaryGeneratedColumn("increment", { name: 'id' })
    id: bigint;

    @Column('bigint', {
        name: 'vid',
        nullable: true,
    })
    vid: bigint;

    @Column('bigint', {
        name: 'vinr_id',
        nullable: true,
    })
    vinrId: bigint;

    @Column('bigint', {
        name: 'votr_id',
        nullable: true,
    })
    votrId: bigint;

    @Column('tinyint', {
        name: 'state',
        nullable: true,
    })
    vehicleType: TruckStateEnum;


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
