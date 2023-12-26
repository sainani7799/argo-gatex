import { Column, Entity, Index, PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity('shahi_role')
export class RoleEntity {

  @PrimaryGeneratedColumn("increment", { name: 'role_id' })
  roleId: number;

  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "role_name"
  })
  roleName: string;

  @Column("tinyint", {
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
  @UpdateDateColumn({
    name: "updated_at",
    type: "datetime"
  })
  updatedAt: Date;

  @Column('varchar', {
    name: 'created_user',
  })
  createdUser: string;

  @Column('varchar', {
    name: 'updated_user',
  })
  updatedUser: string;

  @VersionColumn({
    default: 1,
    name: "version_flag"
  })
  versionFlag: number;
  Id: any;
}

