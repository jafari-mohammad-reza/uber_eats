import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CategoryResolver } from './category.resolver';
import { CloudinaryService } from '../cloudinary/clodinary.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

const mockCategoryRepository = {
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn(() => []),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
};
const mockRestaurantRepository = {
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
};
describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        RestaurantService,
        CategoryResolver,
        CloudinaryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(RestaurantEntity),
          useValue: RestaurantEntity,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return list of categories', async function () {
    const result = await service.getAll({ take: 10, page: 1 });
    expect(result).toBeDefined();
  });
});
