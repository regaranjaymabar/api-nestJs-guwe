import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './entities/book-entity.js';
import { CreateBookDto } from './dto/create-book-dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
    remove(arg0: string): boolean {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ){}
    //menampilkan data buku dari db
    async findAll(id: string): Promise<Book[]> {
        return await this.bookRepository.find({
            order:{createdAt:'DESC'}
        });
    }

    //menampilkan data buku berdasarkan id dari db
    async findOne(id: string): Promise<Book> {
        const book = await this.bookRepository.findOneBy({id});

        if(!book){
            throw new NotFoundException('buku tidak ditemukan')
        }

        return book
    }

    //menyimpan data buku baru ke db
    async create(book: CreateBookDto): Promise<Book> {
        const newBook = this.bookRepository.create(book)

        return await this.bookRepository.save(newBook);
        
    }

    //mengupdate data buku berdasarkan id dari db
    async update(id: string, book: CreateBookDto): Promise<Book> {
        const indexBook = await this.findOne(id)

        const updatedBook = this.bookRepository.merge(indexBook,book)

        return await this.bookRepository.save(updatedBook)
        
    }

    async delete(id: string): Promise<{message:string,deletedId:string}> {
        await this.findAll(id)

        await this.bookRepository.softDelete(id)

        return{
            message:'data dihapus',
            deletedId: id
        }

    }

}