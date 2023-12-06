import { Column, Entity,  CreateDateColumn, UpdateDateColumn, VersionColumn,PrimaryGeneratedColumn } from 'typeorm';

@Entity('shahi_address') 
export class AddressEntity  {

    @PrimaryGeneratedColumn("increment", { name: 'address_id' })
    addressId: number;

    @Column('varchar', {
        name: 'addresser',
        length: 50
    })
    addresser: string;

    @Column('int', {
        name: 'addresser_name_id',
    })
    addresserNameId: number;

    @Column('varchar', {
        name: 'gst_no',
    })
    gstNo: string;

    @Column('varchar', {
        name: 'cst_no',
    })
    cstNo: string;

    @Column('varchar', {
        name: 'line_one',
    })
    lineOne: string;

    @Column('varchar', {
        name: 'line_two',
    })
    lineTwo: string;

    @Column('varchar', {
        name: 'city',
    })
    city: string;

    @Column('varchar', {
        name: 'dist',
    })
    dist: string;

    @Column('int', {
        name: 'pin_code',
    })
    pinCode: number;

    @Column('varchar', {
        name: 'state',
    })
    state: string;

    @Column('varchar', {
        name: 'country',
    })
    country: string;

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

    @Column({
        nullable: false,
        name: "is_active",
        default: 1
    })
    isActive: boolean;

    @VersionColumn({
        default: 1,
        name: "version_flag"
    })
    versionFlag: number;

}