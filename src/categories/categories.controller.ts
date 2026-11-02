import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoriesDto } from './dto/create-category.js';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    //menampilkan semua data kategori
    @Get()
    getAllCategories() {
        return this.categoriesService.findAll();
    }

    //mengambil data kategori berdasarkan id
    @Get(':id')
    getCategoryById(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    //menyimpan data kategori baru
    @Post()
    createCategory(@Body() category: CreateCategoriesDto) {
        return this.categoriesService.create(category);
    }

    //mengupdate data kategori berdasarkan id
    @Put(':id')
    updateCategory(@Param('id') id: string, @Body() category: CreateCategoriesDto) {
        return this.categoriesService.update(id, category);
    }

    //menghapus data kategori berdasarkan id
    @Delete(':id')
    deleteCategory(@Param('id') id: string) {
        return this.categoriesService.delete(id);
    }
}
