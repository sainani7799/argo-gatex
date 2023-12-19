import { Column, Entity,  CreateDateColumn, UpdateDateColumn, VersionColumn,PrimaryGeneratedColumn } from 'typeorm';

@Entity('shahi_warehouse') 
export class WarehouseEntity  {

    @PrimaryGeneratedColumn("increment", { name: 'warehouse_id' })
    warehouseId: number;

    @Column('varchar', {
        name: 'warehouse_name',
        length: 100
    })
    warehouseName: string;

    @Column('int', {
        name: 'unit_id',
    })
    unitId: number;


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