import { Column, Entity, Index, PrimaryGeneratedColumn, VersionColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity('shahi_employees')
export class EmployeeEntity {

    @PrimaryGeneratedColumn("increment", { name: 'employee_id' })
    employeeId: number;

    @Column("varchar", {
        nullable: false,
        name: "employee_name"
    })
    employeeName: string;

    @Column("varchar", {
        nullable: false,
        name: "employee_code"
    })
    employeeCode: string;

    @Column("varchar", {
        nullable: false,
        name: "card_no"
    })
    cardNo: string;

    @Column("int", {
        nullable: false,
        name: "designation"
    })
    designation: number;

    @Column("varchar", {
        nullable: false,
        name: "date_of_birth"
    })
    dateOfBirth: string;

    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "gender"
    })
    gender: string;

    @Column("varchar", {
        nullable: false,
        name: "marital_status"
    })
    maritalStatus: string;

    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "email_id"
    })
    emailId: string;

    @Column("int", {
        nullable: false,
        name: "department"
    })
    department: number;

    @Column("int", {
        nullable: false,
        name: "section"
    })
    section: number;

    @Column("varchar", {
        nullable: false,
        name: "unit"
    })
    unit: string;

    @Column("varchar", {
        nullable: false,
        name: "address"
    })
    address: string;


    @Column('varchar',{
        name: "mobile_number",
    })
    mobileNumber: string;

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

    // @Column("varchar", {
    //     nullable: false,
    //     name: "created_user"
    // })
    // createdUser: string | null;

    // @Column("varchar", {
    //     nullable: true,
    //     name: "updated_user"
    // })
    // updatedUser: string | null;


    @VersionColumn({
        default: 1,
        name: "version_flag"
    })
    versionFlag: number;
}