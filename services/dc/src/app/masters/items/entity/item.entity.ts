import { Column, Entity,  CreateDateColumn, UpdateDateColumn, VersionColumn,PrimaryGeneratedColumn } from 'typeorm';

@Entity('shahi_items') 
export class ItemEntity  {

    @PrimaryGeneratedColumn("increment", { name: 'item_id' })
    itemId: number;

    @Column('varchar', {
        name: 'item_code',
        length: 50
    })
    itemCode: string;

    @Column('varchar', {
        name: 'item_name',
        length: 50
    })
    itemName: string;

    @Column('varchar', {
        name: 'description',
    })
    description: string;

    @Column('varchar', {
        name: 'uom',
    })
    uom: string;


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

    @Column("boolean", {
        default: true,
        name: "is_active"
    })
    isActive: boolean;

    @VersionColumn({
        default: 1,
        name: "version_flag"
    })
    versionFlag: number;

}