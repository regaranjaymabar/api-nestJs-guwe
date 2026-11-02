import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CustomersService } from './customers.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';

@Controller('customers')
export class CustomersController {
    constructor(private customersService: CustomersService) {}

    //menampilkan semua data customer
    @Get()
    getAllCustomers() {
        return this.customersService.findAll();
    }

    //mengambil data customer berdasarkan id
    @Get(':id')
    getCustomerById(@Param('id') id: string) {
        return this.customersService.findOne(id);
    }

    //menyimpan data customer baru
    @Post()
    createCustomer(@Body() customer: CreateCustomerDto) {
        return this.customersService.create(customer);
    }

    //mengupdate data customer berdasarkan id
    @Put(':id')
    updateCustomer(@Param('id') id: string, @Body() customer: CreateCustomerDto) {
        return this.customersService.update(id, customer);
    }

    //menghapus data customer berdasarkan id
    @Delete(':id')
    deleteCustomer(@Param('id') id: string) {
        return this.customersService.delete(id);
    }
}
