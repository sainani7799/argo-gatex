import { Column, Entity,  CreateDateColumn, UpdateDateColumn, VersionColumn,PrimaryGeneratedColumn } from 'typeorm';

@Entity('shahi_buyer') 
export class BuyerTeamEntity  {

    @PrimaryGeneratedColumn("increment", { name: 'buyer_team_id' })
    buyerTeamId: number;

    @Column('varchar', {
        name: 'buyer_team',
        length: 100
    })
    buyerTeam: string;

    @CreateDateColumn({
        name: "created_at",
        type: "datetime"
    })
    createdAt: Date;
    

    @Column('varchar', {
        name: 'created_user',
    })
    createdUser: string;

    @Column('varchar', {
        name: 'updated_user',
    })
    updatedUser: string;

    @Column({
        nullable: false,
        name: "is_active",
        default: 1
    })
    isActive: boolean;

    @VersionColumn({
        default: 1,
        name: "version_flag"
    })
    versionFlag: number;

}