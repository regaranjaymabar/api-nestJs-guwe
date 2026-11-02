import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerAddress } from "./customer-address.entity.js";

@Entity('customers')
export class Customer{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length:150})
    name:string;

    @Column({type: 'varchar', length:150, unique:true})
    email:string;

    @Column({type: 'varchar', length:20})
    phone:string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at', nullable:true})
    deletedAt: Date;

    // Relasi ke customer_address (1 customer bisa memiliki banyak address)
    @OneToMany(() => CustomerAddress, (address) => address.customer)
    address:CustomerAddress[];
}
