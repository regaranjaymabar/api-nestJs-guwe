import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category-entities.js';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
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
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
