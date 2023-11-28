import { Column, Entity, Index, PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity('project')
export class ProjectEntity {

    @PrimaryGeneratedColumn("increment", { name: 'project_id' })
    projectId: number;

    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "project_name"
    })
    projectName: string;

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