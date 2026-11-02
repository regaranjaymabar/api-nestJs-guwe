import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './entities/customer-entity.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>
    ){}

    //menampilkan semua data customer dari db
    async findAll(): Promise<Customer[]> {
        return await this.customerRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    //menampilkan data customer berdasarkan id dari db
    async findOne(id: string): Promise<Customer> {
        const customer = await this.customerRepository.findOneBy({ id });

        if (!customer) {
            throw new NotFoundException('customer tidak ditemukan');
        }

        return customer;
    }

    //menyimpan data customer baru ke db
    async create(customer: CreateCustomerDto): Promise<Customer> {
        const newCustomer = this.customerRepository.create(customer);

        return await this.customerRepository.save(newCustomer);
    }

    //mengupdate data customer berdasarkan id dari db
    async update(id: string, customer: CreateCustomerDto): Promise<Customer> {
        const existingCustomer = await this.findOne(id);

        const updatedCustomer = this.customerRepository.merge(existingCustomer, customer);

        return await this.customerRepository.save(updatedCustomer);
    }

    //menghapus data customer berdasarkan id (soft delete)
    async delete(id: string): Promise<{ message: string, deletedId: string }> {
        await this.findOne(id);

        await this.customerRepository.softDelete(id);

        return {
            message: 'data customer dihapus',
            deletedId: id
        };
    }
}
