import { Injectable } from '@nestjs/common';
import { Book } from './entities/book-entity.js';
import { CreateBookDto } from './dto/create-book-dto.js';

@Injectable()
export class BooksService {
    findById(id: number) {
        throw new Error('Method not implemented.');
    }
    //db
    private books: Book[] = [
        {
            id: 1,
            name: 'Buku A',
            author: 'Penulis A',
            isbn: '1234567890',
            publishedYear: 2020,
            isAvailable: true
        },
        {
            id: 2,
            name: 'Buku B',
            author: 'Penulis B',
            isbn: '0987654321',
            publishedYear: 2021,
            isAvailable: false
        }
    ];

    //menampilkan data buku dari db
    findAll(): Book[] {
        return this.books;
    }

    //menampilkan data buku berdasarkan id dari db
    findOne(id: number): Book | undefined {
        return this.books.find(book => book.id === id);
    }

    //menyimpan data buku baru ke db
    create(book: CreateBookDto): Book {
        const newBook: Book = {
            id: this.books.length + 1,
            name: book.name,
            author: book.author,
            isbn: book.isbn,
            publishedYear: book.publishedYear,
            isAvailable: true
        };
        
        //simpan data buku baru ke db
        this.books.push(newBook);
        return newBook;
    }

    //mengupdate data buku berdasarkan id dari db
    update(id: number, book: CreateBookDto): Book | undefined {
        const index = this.books.findIndex(b => b.id === id);
        if (index !== -1) {
            this.books[index] = { ...this.books[index], ...book };
            return this.books[index];
        }
        return undefined;
    }

    remove(id: number): boolean {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1) {
            return false;
        }

        this.books.splice(index, 1);
        return true;
    }
}