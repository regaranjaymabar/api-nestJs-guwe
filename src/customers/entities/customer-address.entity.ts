import { IsUUID } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./customer-entity.js";

@Entity('customeraddress')
export class CustomerAddress{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @IsUUID('4', { message: 'Customer ID harus berupa UUID valid!' })
    @Column({type:'uuid', name:'customer_id'})
    customerId:string;

    @Column({type:'varchar', length:150, name:'recipient_name'})
    recipientName:string;

    @Column({type:'varchar', length:20})
    phone:string;

    @Column({type:'text'})
    address:string;

    @Column({type:'varchar', length:100})
    city:string;

    @Column({type:'varchar', length:10, name:'postal_code'})
    postalCode:string;

    @CreateDateColumn({name: 'created_at'})
    createdAt:Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt:Date;

    // Relasi ke customer (banyak address bisa dimiliki 1 customer yang sama)
    @ManyToOne(() => Customer,(customer) => customer.address,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'customer_id'})
    customer: Customer

}
