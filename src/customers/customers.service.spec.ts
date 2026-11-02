import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './entities/customer-entity.js';
import { CustomerAddress } from './entities/customer-address.entity.js';

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            find: () => Promise.resolve([]),
            findOne: () => Promise.resolve({}),
            findOneBy: () => Promise.resolve({}),
            create: (dto: any) => dto,
            save: (entity: any) => Promise.resolve(entity),
            merge: (target: any, source: any) => Object.assign(target, source),
            softDelete: () => Promise.resolve({ raw: [], affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(CustomerAddress),
          useValue: {
            find: () => Promise.resolve([]),
            findOne: () => Promise.resolve({}),
            create: (dto: any) => dto,
            save: (entity: any) => Promise.resolve(entity),
            merge: (target: any, source: any) => Object.assign(target, source),
            delete: () => Promise.resolve({ raw: [], affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
