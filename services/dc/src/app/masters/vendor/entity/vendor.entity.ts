import { Column, Entity, Index, PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity('vendor')
export class VendorEntity {

    @PrimaryGeneratedColumn("increment", { name: 'vendor_id' })
    vendorId: number;

    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "vendor_name"
    })
    vendorName: string;

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
        nullable: false,
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