import {Column,Entity,Index,PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn} from "typeorm";

@Entity('shahi_department')
export class DepartmentEntity {

  @PrimaryGeneratedColumn("increment",{name:'id'})
  id:number;

  @Column("varchar",{
      nullable:false,
      length:50,
      name:"department_name"
      })
  departmentName:string;

    @Column("boolean",{
      nullable:false,
      default:true,
      name:"is_active"
      })
      isActive:boolean;

  @CreateDateColumn({
    name: "created_at",
    type:"datetime"
  })
  createdAt: Date; 


  @VersionColumn({
      default:1,
      name: "version_flag"
  })
  versionFlag: number;
}