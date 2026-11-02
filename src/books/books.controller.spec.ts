import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';

describe('BooksController', () => {
  let controller: BooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            findAll: () => Promise.resolve([]),
            findOne: () => Promise.resolve({}),
            create: () => Promise.resolve({}),
            update: () => Promise.resolve({}),
            delete: () => Promise.resolve({ message: 'data dihapus', deletedId: '1' }),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
