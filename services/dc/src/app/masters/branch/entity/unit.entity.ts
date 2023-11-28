import { Column, Entity, Index, PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity('shahi_units')
export class UnitEntity {

  @PrimaryGeneratedColumn("increment", { name: 'id' })
  id: number;

  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "unit_code"
  })
  unitCode: string;

  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "factory_code"
  })
  factoryCode: string;

  @Column("varchar", {
    nullable: false,
    length: 50,
    name: "unit_name"
  })
  unitName: string;

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