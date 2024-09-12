import { Column, Entity, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, VersionColumn,PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity('shahi_user') 
export class UserEntity  {

    @PrimaryGeneratedColumn("increment", { name: 'id' })
    userId: number;

    @Column('varchar', {
        name: 'user_name',
        length: 100
    })
    userName: string;

    @Column('varchar', {
        name: 'password',
    })
    password: string;

    // @Column({ 
    //     type: 'varchar', 
    //     nullable: false 
    // }) 
    // password?: string;  @Column({ 
    //     type: 'varchar', 
    //     nullable: false 
    // })
    
    @Column("int", { name: 'employee_id' })
    employeeId: number;

    @Column("varchar", {
        nullable: false,
        name: "card_no",
        length: 50
    })
    cardNo: string | null;

    @Column('int', {
        name: 'unit_id',
    })
    unitId: number;

    @Column('int', {
        name: 'role_id',
    })
    roleId: number;

    @Column({
        nullable: false,
        name: "is_active",
    })
    isActive: boolean;
    // @BeforeInsert()  
    // // @BeforeUpdate()
    //     async hashPassword() {
    //         if(this.password){

    //             this.password = await bcrypt.hash(this.password, 10);  
    //         }
    // }

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

    @Column("varchar", {
        nullable: false,
        name: "buyer_team",
        length: 50
    })
    buyerTeam: string | null;

}