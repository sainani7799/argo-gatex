import { Column, Entity, Index, PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity('shahi_designation')
export class DesignationEntity {

    @PrimaryGeneratedColumn("increment", { name: 'designation_id' })
    designationId: number;

    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "designation"
    })
    designation: string;

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


    @VersionColumn({
        default: 1,
        name: "version_flag"
    })
    versionFlag: number;
}