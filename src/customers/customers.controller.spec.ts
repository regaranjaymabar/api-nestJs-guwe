import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller.js';
import { CustomersService } from './customers.service.js';

describe('CustomersController', () => {
  let controller: CustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            findAll: () => Promise.resolve([]),
            findOne: () => Promise.resolve({}),
            create: () => Promise.resolve({}),
            update: () => Promise.resolve({}),
            delete: () => Promise.resolve({ message: 'data customer dihapus', deletedId: '1' }),
            findAllAddresses: () => Promise.resolve([]),
            findOneAddress: () => Promise.resolve({}),
            createAddress: () => Promise.resolve({}),
            updateAddress: () => Promise.resolve({}),
            deleteAddress: () => Promise.resolve({ message: 'alamat customer dihapus', deletedId: '1' }),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
