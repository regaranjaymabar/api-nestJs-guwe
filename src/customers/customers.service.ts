import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './entities/customer-entity.js';
import { CustomerAddress } from './entities/customer-address.entity.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,

        @InjectRepository(CustomerAddress)
        private readonly addressRepository: Repository<CustomerAddress>
    ){}


    async findAll(): Promise<Customer[]> {
        return await this.customerRepository.find({
            relations: { address: true },
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string): Promise<Customer> {
        const customer = await this.customerRepository.findOne({
            where: { id },
            relations: { address: true }
        });

        if (!customer) {
            throw new NotFoundException('customer tidak ditemukan');
        }

        return customer;
    }


    async create(customer: CreateCustomerDto): Promise<Customer> {
        const newCustomer = this.customerRepository.create(customer);

        return await this.customerRepository.save(newCustomer);
    }


    async update(id: string, customer: CreateCustomerDto): Promise<Customer> {
        const existingCustomer = await this.findOne(id);

        const updatedCustomer = this.customerRepository.merge(existingCustomer, customer);

        return await this.customerRepository.save(updatedCustomer);
    }


    async delete(id: string): Promise<{ message: string, deletedId: string }> {
        await this.findOne(id);

        await this.customerRepository.softDelete(id);

        return {
            message: 'data customer dihapus',
            deletedId: id
        };
    }


    async findAllAddresses(customerId: string): Promise<CustomerAddress[]> {
        await this.findOne(customerId);

        return await this.addressRepository.find({
            where: { customerId },
            order: { createdAt: 'DESC' }
        });
    }


    async findOneAddress(customerId: string, addressId: string): Promise<CustomerAddress> {
        await this.findOne(customerId);

        const address = await this.addressRepository.findOne({
            where: { id: addressId, customerId }
        });

        if (!address) {
            throw new NotFoundException('alamat tidak ditemukan');
        }

        return address;
    }


    async createAddress(customerId: string, dto: CreateCustomerAddressDto): Promise<CustomerAddress> {
        await this.findOne(customerId);

        const newAddress = this.addressRepository.create({
            recipientName: dto.recipientName,
            phone: dto.phone,
            address: dto.address,
            city: dto.city,
            postalCode: dto.postalCode,
            customerId
        });

        return await this.addressRepository.save(newAddress);
    }


    async updateAddress(customerId: string, addressId: string, dto: CreateCustomerAddressDto): Promise<CustomerAddress> {
        const existingAddress = await this.findOneAddress(customerId, addressId);

        const updatedAddress = this.addressRepository.merge(existingAddress, {
            recipientName: dto.recipientName,
            phone: dto.phone,
            address: dto.address,
            city: dto.city,
            postalCode: dto.postalCode,
        });

        return await this.addressRepository.save(updatedAddress);
    }


    async deleteAddress(customerId: string, addressId: string): Promise<{ message: string, deletedId: string }> {
        await this.findOneAddress(customerId, addressId);

        await this.addressRepository.delete(addressId);

        return {
            message: 'alamat customer dihapus',
            deletedId: addressId
        };
    }
}
