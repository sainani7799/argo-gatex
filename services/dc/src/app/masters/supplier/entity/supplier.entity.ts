import { Column, Entity,  CreateDateColumn, UpdateDateColumn, VersionColumn,PrimaryGeneratedColumn } from 'typeorm';

@Entity('shahi_suppliers') 
export class SupplierEntity  {

    @PrimaryGeneratedColumn("increment", { name: 'supplier_id' })
    supplierId: number;

    @Column('varchar', {
        name: 'supplier_name',
    })
    supplierName: string;

    @Column('varchar', {
        name: 'supplier_code',
    })
    supplierCode: string;

    @CreateDateColumn({
        name: "created_at",
        type: "datetime"
    })
    createdAt: Date;
    

    @Column('varchar', {
        name: 'created_user',
    })
    createdUser: string;

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