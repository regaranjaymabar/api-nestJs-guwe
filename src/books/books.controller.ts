import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book-dto.js';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    //menampilkan semua data buku
    @Get()
    getAllBooks() {
        return this.booksService.findAll();
    }

    //mengambil data buku berdasarkan id
    @Get(':id')
    getBookById(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    //menyimpan data buku baru
    @Post()
    createBook(@Body() book: CreateBookDto) {
        return this.booksService.create(book);
    }

    //mengupdate data buku berdasarkan id
    @Put(':id')
    updateBook(@Param('id') id: string, @Body() book: CreateBookDto) {
        return this.booksService.update(id, book);
    }

    //menghapus data buku berdasarkan id
    @Delete(':id')
    deleteBook(@Param('id') id: string) {
        return this.booksService.delete(id);
    }
}
