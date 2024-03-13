import { StatusEnum } from "libs/shared-models";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { DcEntity } from "./dc.entity";

@Entity('shahi_dc_items')
export class DcItemEntity {

    @PrimaryGeneratedColumn("increment", { name: 'dc_item_id' })
    dcItemId: number;

    @Column('varchar', {
        name: 'item_code',
        nullable: false
    })
    itemCode: string;

    @Column('varchar', {
        name: 'item_name',
        nullable: false
    })
    itemName: string;

    @Column('varchar', {
        name: 'description',
        nullable: false
    })
    description: string;

    @Column('varchar', {
        name: 'item_type',
    })
    itemType:string;

    @Column('varchar', {
        name: 'uom',
        nullable: false
    })
    uom: string;

    @Column('int', {
        name: 'qty',
        nullable: false
    })
    qty: number;

    @Column('int', {
        name: 'rate',
        nullable: false
    })
    rate: number;

    @Column('varchar', {
        name: 'amount',
        nullable: false
    })
    amount: string;

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

    @ManyToOne(type => DcEntity, i => i.dcItemInfo, { nullable: false, })
    @JoinColumn({ name: "dc_id" })
    itemInfo: DcEntity;
}
