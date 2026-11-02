import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category-entities.js';
import { CreateCategoriesDto } from './dto/create-category.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ){}

    //menampilkan semua data kategori dari db
    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    //menampilkan data kategori berdasarkan id dari db
    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new NotFoundException('kategori tidak ditemukan');
        }

        return category;
    }

    //menyimpan data kategori baru ke db
    async create(category: CreateCategoriesDto): Promise<Category> {
        const newCategory = this.categoryRepository.create(category);

        return await this.categoryRepository.save(newCategory);
    }

    //mengupdate data kategori berdasarkan id dari db
    async update(id: string, category: CreateCategoriesDto): Promise<Category> {
        const existingCategory = await this.findOne(id);

        const updatedCategory = this.categoryRepository.merge(existingCategory, category);

        return await this.categoryRepository.save(updatedCategory);
    }

    //menghapus data kategori berdasarkan id (soft delete)
    async delete(id: string): Promise<{ message: string, deletedId: string }> {
        await this.findOne(id);

        await this.categoryRepository.softDelete(id);

        return {
            message: 'data kategori dihapus',
            deletedId: id
        };
    }
}
