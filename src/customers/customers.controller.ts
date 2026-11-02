import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CustomersService } from './customers.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto.js';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Get()
    getAllCustomers() {
        return this.customersService.findAll();
    }

    @Get(':id')
    getCustomerById(@Param('id') id: string) {
        return this.customersService.findOne(id);
    }


    @Post()
    createCustomer(@Body() customer: CreateCustomerDto) {
        return this.customersService.create(customer);
    }

    @Put(':id')
    updateCustomer(@Param('id') id: string, @Body() customer: CreateCustomerDto) {
        return this.customersService.update(id, customer);
    }

    deleteCustomer(@Param('id') id: string) {
        return this.customersService.delete(id);
    }


    @Get(':id/addresses')
    getCustomerAddresses(@Param('id') customerId: string) {
        return this.customersService.findAllAddresses(customerId);
    }

    
    @Get(':id/addresses/:addressId')
    getCustomerAddressById(
        @Param('id') customerId: string,
        @Param('addressId') addressId: string,
    ) {
        return this.customersService.findOneAddress(customerId, addressId);
    }

    
    @Post(':id/addresses')
    createCustomerAddress(
        @Param('id') customerId: string,
        @Body() createAddressDto: CreateCustomerAddressDto,
    ) {
        return this.customersService.createAddress(customerId, createAddressDto);
    }

    @Put(':id/addresses/:addressId')
    updateCustomerAddress(
        @Param('id') customerId: string,
        @Param('addressId') addressId: string,
        @Body() updateAddressDto: CreateCustomerAddressDto,
    ) {
        return this.customersService.updateAddress(customerId, addressId, updateAddressDto);
    }

    @Delete(':id/addresses/:addressId')
    deleteCustomerAddress(
        @Param('id') customerId: string,
        @Param('addressId') addressId: string,
    ) {
        return this.customersService.deleteAddress(customerId, addressId);
    }
}
