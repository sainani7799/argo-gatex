import { Column, Entity, CreateDateColumn, UpdateDateColumn, VersionColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicle')
export class VehicleEntity {

    @PrimaryGeneratedColumn("increment", { name: 'vehicle_id' })
    vehicleId: number;


    @Column('int', {
        name: 'dc_id',
    })
    dcId: number;

    @Column('varchar', {
        name: 'vehicle_type',
        length: 100
    })
    vehicleType: string;

    @Column('varchar', {
        name: 'vehicle_no',
        length: 100
    })
    vehicleNo: string;

    @Column('varchar', {
        name: 'driver_name',
        length: 100
    })
    driverName: string;

    @Column('varchar', {
        name: 'driver_phone',
        length: 100
    })
    driverPhone: string;

    @Column('varchar', {
        name: 'invoice_no',
        length: 100
    })
    invoiceNo: string;


    @Column('varchar', {
        name: 'security_person',
        length: 100
    })
    securityPerson: string;

    @Column('datetime', {
        name: 'in_time',
    })
    inTime: Date;

    @Column('datetime', {
        name: 'out_time',
    })
    outTime: Date;

    @Column('int', {
        name: 'net_weight',
    })
    netWeight: number;

    @Column('int', {
        name: 'gross_weight',
    })
    grossWeight: number;

    @Column('varchar', {
        name: 'cus_dec_no',
        length: 100
    })
    cusDecNo: string;

    @Column('varchar', {
        name: 'container_no',
        length: 100
    })
    containerNo: string;

    @Column('varchar', {
        name: 'status',
        length: 100
    })
    status: string;

    @Column({
        nullable: false,
        name: "is_active",
        default: 1
    })
    isActive: boolean;



    @CreateDateColumn({
        name: "created_at",
        type: "datetime"
    })
    createdAt: Date;


    @Column('varchar', {
        name: 'created_user',
    })
    createdUser: string;

    @Column('varchar', {
        name: 'updated_user',
    })
    updatedUser: string;


    @CreateDateColumn({
        name: "updated_at",
        type: "datetime"
    })
    updatedAt: Date;

    @VersionColumn({
        default: 1,
        name: "version_flag"
    })
    versionFlag: number;

}