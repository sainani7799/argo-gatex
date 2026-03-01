import { LocationFromTypeEnum, LocationToTypeEnum, ReqStatus } from "@gatex/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('vehicle_inr')
export class VehicleINREntity {
    @PrimaryGeneratedColumn("increment", { name: 'id' })
    id: number;

    @Column('varchar', {
        name: 'ref_id',
        nullable: true,
        length: 12
    })
    refId: string;

    @Column('varchar', {
        name: 'ref_number',
        nullable: true,
        length: 30
    })
    refNumber: string;

    @Column('datetime', {
        name: 'expected_arrival',
        nullable: true,
    })
    expectedArrival: Date;

    @Column('text', {
        name: 'from',
        nullable: true,
    })
    from: string;

    @Column('text', {
        name: 'to',
        nullable: true,
    })
    to: string;

    @Column({
        type: "enum",
        enum: LocationFromTypeEnum,
        nullable: true,
        name: "from_type"
    })
    fromType: LocationFromTypeEnum;

    @Column({
        type: "enum",
        enum: LocationToTypeEnum,
        nullable: true,
        name: "to_type"
    })
    toType: LocationToTypeEnum;

    @Column('tinyint', {
        name: 'ready_to_in',
        default: 1,
        nullable: true,
    })
    readyToIn: number;

    @Column('tinyint', {
        name: "req_status",
        nullable: true,
    })
    reqStatus: ReqStatus;

    @Column('tinyint', {
        name: 'has_items',
        nullable: true,
    })
    hasItems: number;

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
