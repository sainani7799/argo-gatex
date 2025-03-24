import { TruckStateEnum } from "libs/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('vehicle_state')
export class VehicleStateEntity {

    @PrimaryGeneratedColumn("increment", { name: 'id' })
    id: number;

    @Column('bigint', {
        name: 'vid',
        nullable: true,
    })
    vid: number;

    @Column('bigint', {
        name: 'vinr_id',
        nullable: true,
    })
    vinrId: number;

    @Column('bigint', {
        name: 'votr_id',
        nullable: true,
    })
    votrId: number;

    @Column('tinyint', {
        name: 'state',
        nullable: true,
    })
    vState: TruckStateEnum;


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
