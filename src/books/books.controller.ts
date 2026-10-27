import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book-dto.js';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

        //menampilkan data
    @Get()
    getAllBooks() {
        //logic untuk mengambil semua data buku dari database atau sumber data lainnya
        return this.booksService.findAll('');
    }
    //mengambil data buku berdasarkan id
    @Get(':id')
    getBookById(@Param('id') id: string) {
        //logic untuk mengambil data buku berdasarkan id dari database atau sumber data lainnya
        return this.booksService.findOne((id));
    }

    //menyimpan data buku baru
    @Post()
    createBook(@Body() book: CreateBookDto) {
        //logic untuk menyimpan data buku baru ke database atau sumber data lainnya
        return this.booksService.create(book);

    }

    //mengupdate data buku berdasarkan id
    @Put(':id')
    updateBook(@Param('id') id: string, @Body() book: CreateBookDto) {
        //logic untuk mengupdate data buku berdasarkan id di database atau sumber data lainnya
        return this.booksService.update((id), book);
    }

    //menghapus data buku berdasarkan id
    @Delete(':id')
    deleteBook(@Param('id') id: string): boolean {
        return this.booksService.remove((id));
    }

}

