import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Category } from "../../categories/entities/category-entities.js";

@Entity('books')
export class Book{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'varchar',length:64})
    name: string;

    @Column({type:'varchar',length:64})
    author: string;

    @Column({type:'varchar'})
    isbn: string;

    @Column({type:'int'})
    publishedYear: number;

    @Column({type:'boolean', default:true})
    isAvailable: boolean;

    @Column({type:'uuid', name:'category_id', nullable:true})
    categoryId: string;


    @ManyToOne(() => Category, (category) => category.books, {
        onDelete: 'SET NULL',
        nullable: true
    })
    @JoinColumn({name: 'category_id'})
    category: Category;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name:'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name:'deleted_at', nullable:true})
    deletedAt: Date;
}
