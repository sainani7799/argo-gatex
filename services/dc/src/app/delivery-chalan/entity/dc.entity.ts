import { AcceptableEnum, StatusEnum } from "libs/shared-models";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { DcItemEntity } from "./dc-items.entity";

@Entity('shahi_dc')
export class DcEntity {

  @PrimaryGeneratedColumn("increment", { name: 'dc_id' })
  dcId: number;

  @Column('varchar', {
    name: 'dc_number',
    nullable: false
  })
  dcNumber: string;

  @Column('int', {
    name: 'from_unit_id',
    nullable: false
  })
  fromUnitId: number;

  @Column('int', {
    name: 'warehouse_id',
    nullable: false
  })
  warehouseId: number;

  @Column('int', {
    name: 'department_id',
    nullable: false
  })
  departmentId: number;

  @Column('varchar', {
    name: 'po_no',
    nullable: false
  })
  poNo: string;

  @Column('varchar', {
    name: 'mode_of_transport',
    nullable: false
  })
  modeOfTransport: string;

  @Column('varchar', {
    name: 'to_addresser',
    nullable: false
  })
  toAddresser: string;

  @Column('int', {
    name: 'addresser_name_id',
    nullable: false
  })
  addresserNameId: number;

  @Column('varchar', {
    name: 'weight',
    nullable: false
  })
  weight: string;

  @Column('varchar', {
    name: 'vehicle_no',
    nullable: false
  })
  vehicleNo: string;

  @Column('varchar', {
    name: 'returnable',
    nullable: false,
    default:'NO'
  })
  returnable: string;

  @Column('varchar', {
    name: 'purpose',
    nullable: false
  })
  purpose: string;

  @Column('varchar', {
    name: 'value',
    nullable: false
  })
  value: string;

  @Column('enum', {
    name: 'status',
    nullable: false,
    enum: StatusEnum,
    default: StatusEnum.ASSIGN_TO_APPROVAL
  })
  status: StatusEnum;

  @Column('int', {
    name: 'requested_by',
    nullable: false
  })
  requestedBy: number;

  @Column('varchar', {
    name: 'remarks',
    nullable: false
  })
  remarks: string;

  @Column('enum', {
    name: 'is_accepted',
    nullable: false,
    enum: AcceptableEnum,
    default: AcceptableEnum.NO
  })
  isAccepted: AcceptableEnum;

  @Column('enum', {
    name: 'is_assignable',
    nullable: false,
    enum: AcceptableEnum,
    default: AcceptableEnum.NO
  })
  isAssignable: AcceptableEnum;

  @Column('int', {
    name: 'assign_by',
    nullable: false
  })
  assignBy: number;

  @Column('int', {
    name: 'accepted_user',
    nullable: false
  })
  acceptedUser: number;

  @Column('varchar', {
    name: 'attention_person',
    nullable: false
  })
  attentionPerson: string;

  @Column('int', {
    name: 'to_department_id',
    nullable: false
  })
  toDepartmentId: number;


  @Column('varchar', {
    name: 'email_id',
  })
  emailId: string;

  @Column('enum', {
    name: 'received_dc',
    nullable: false,
    enum: AcceptableEnum,
    default: AcceptableEnum.NO
  })
  receivedDc: AcceptableEnum;

  @Column('varchar', {
    name: 'received_user',
  })
  receivedUser: string;

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
    nullable: true,
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

  @Column("varchar", {
    nullable: true,
    name: "security_user"
  })
  securityUser: string | null;

  @VersionColumn({
    default: 1,
    name: "version_flag"
  })
  versionFlag: number;

  @UpdateDateColumn({
    name: "checkout_time",
    type: 'datetime'
  })
  checkoutTime: Date;

  @UpdateDateColumn({
    name: "checkin_time",
    type: 'datetime'
  })
  checkInTime: Date;

  @UpdateDateColumn({
    name: "received_date",
    type: 'datetime'
  })
  receivedDate: Date;

  @Column({
    type: 'timestamp',
    name: 'sec_checked_date',
    nullable: true 
   })
   securityCheckedDate: Date;

   @Column({
    type: 'timestamp',
    name: 'expected_return_date',
    nullable: true 
   })
   expectedReturnDate: any;

   @Column('varchar', {
    name: 'buyer_team',
    nullable: true
  })
  buyerTeam: string;

   @Column('varchar', {
    name: 'dc_type',
    nullable: true
  })
  dcType: string;

   @Column('varchar', {
    name: 'returned_by',
    nullable: true
  })
  returnedBy: string;

  @UpdateDateColumn({
    name: "returned_date",
    type: 'datetime'
  })
  returnedDate: Date;

  @OneToMany(type => DcItemEntity, items => items.itemInfo, { cascade: true })
  dcItemInfo: DcItemEntity[];
}
