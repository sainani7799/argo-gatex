import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, VersionColumn } from "typeorm";

@Entity('shahi_approved_users')

export class ApprovedUserEntity {
  
  @PrimaryGeneratedColumn("increment",{
    name:'approved_id'
  })
  approvedId:number;

  @Column("varchar",{
    name:"approved_user_name"
    })
    approvedUserName:string;

  @Column("varchar",{
    name:"email_id"
    })
    emailId:string;

  @Column('varchar', {
        name: 'user_signature',
    })
    sigImageName: string;
  
    @Column('varchar', {
      name: 'sign_path',
  })
   signPath: string;

  @Column("boolean",{
    name:"is_active"
    })
  isActive:boolean;

  @CreateDateColumn({
    name: "created_at",
    type:"datetime"
  })
  createdAt: Date;

  @Column("varchar", {
      name: "created_user"
  })
  createdUser: string ;
  
  @VersionColumn({
      default:1,
      name: "version_flag"
  })
  versionFlag: number;
  }
