import {Column,Entity,Index,PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn} from "typeorm";

@Entity('shahi_sections')
export class SectionsEntity {

  @PrimaryGeneratedColumn("increment",{name:'section_id'})
  id:number;

  @Column("int",{
      nullable:false,
      name:"department_id"
      })
  departmentId:number;

    @Column("varchar",{
      nullable:false,
      name:"section_name"
      })
      sectionName:string;

 
}