import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './entities/book-entity.js';
import { CreateBookDto } from './dto/create-book-dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>
    ){}

    //menampilkan data buku dari db beserta kategorinya
    async findAll(): Promise<Book[]> {
        return await this.bookRepository.find({
            relations: { category: true },
            order: { createdAt: 'DESC' }
        });
    }

    //menampilkan data buku berdasarkan id dari db beserta kategorinya
    async findOne(id: string): Promise<Book> {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: { category: true }
        });

        if (!book) {
            throw new NotFoundException('buku tidak ditemukan');
        }

        return book;
    }

    //menyimpan data buku baru ke db
    async create(book: CreateBookDto): Promise<Book> {
        const newBook = this.bookRepository.create(book);
        return await this.bookRepository.save(newBook);
    }

    //mengupdate data buku berdasarkan id dari db
    async update(id: string, book: CreateBookDto): Promise<Book> {
        const existingBook = await this.findOne(id);
        const updatedBook = this.bookRepository.merge(existingBook, book);
        return await this.bookRepository.save(updatedBook);
    }

    //menghapus data buku berdasarkan id (soft delete)
    async delete(id: string): Promise<{ message: string, deletedId: string }> {
        await this.findOne(id);
        await this.bookRepository.softDelete(id);

        return {
            message: 'data dihapus',
            deletedId: id
        };
    }

    //alias untuk kompatibilitas
    async remove(id: string) {
        return this.delete(id);
    }
}
