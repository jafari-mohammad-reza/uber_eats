import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CategoryResolver } from './category.resolver';
import { CloudinaryService } from '../cloudinary/clodinary.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { MockRepositoryType } from '../common/types/testing.types';
import { DefaultImage } from '../common/constants';

const mockCategoryRepository = {
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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
  count: jest.fn(),
};
describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: MockRepositoryType<CategoryEntity>;
  let restaurantRepository: MockRepositoryType<RestaurantEntity>;
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
          useValue: mockRestaurantRepository,
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get(getRepositoryToken(CategoryEntity));
    restaurantRepository = module.get(getRepositoryToken(RestaurantEntity));
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });
  it('should return list of categories', async function () {
    const result = await categoryService.getAll({ take: 10, page: 1 });
    expect(result).toBeDefined();
  });
  describe('find category', function () {
    it('should return a category', async function () {
      categoryRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: 'founded category',
      });
      restaurantRepository.find.mockResolvedValue([{}]);
      restaurantRepository.count.mockResolvedValue(Number);
      const response = await categoryService.getById({
        id: 1,
        take: 10,
        page: 1,
      });
      expect(response).toMatchObject({
        ok: true,
        error: null,
        category: { id: 1, title: 'founded category' },
        restaurants: [{}],
        totalRestaurants: Number,
      });
    });
    it('should not return any category with id', async function () {
      categoryRepository.findOneBy.mockResolvedValue(null);
      const response = await categoryService.getById({
        id: 1,
        take: 10,
        page: 1,
      });
      expect(response).toMatchObject({
        ok: false,
        error: 'There is no category with this title',
      });
    });
    it('should return a category with slug', async function () {
      categoryRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: 'founded category',
      });
      restaurantRepository.find.mockResolvedValue([{}]);
      restaurantRepository.count.mockResolvedValue(Number);
      const response = await categoryService.getBySlug({
        slug: 'founded-category',
        take: 10,
        page: 1,
      });
      expect(response).toMatchObject({
        ok: true,
        error: null,
        category: { id: 1, title: 'founded category' },
        restaurants: [{}],
        totalRestaurants: Number,
      });
    });
    it('should not return any category', async function () {
      categoryRepository.findOneBy.mockResolvedValue(null);
      const response = await categoryService.getBySlug({
        slug: 'founded-category',
        take: 10,
        page: 1,
      });
      expect(response).toMatchObject({
        ok: false,
        error: 'There is no category with this title',
      });
    });
  });
  describe('Create category', function () {
    it('should create category successfully', async function () {
      categoryRepository.findOneBy.mockResolvedValue(undefined);
      const response = await categoryService.createOne({
        title: 'category',
        image: DefaultImage,
      });
      expect(response).toMatchObject({ ok: true, error: null });
    });
    it('should create category fail it already exist', async function () {
      categoryRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: 'category',
      });
      const response = await categoryService.createOne({
        title: 'category',
        image: DefaultImage,
      });
      expect(response).toMatchObject({
        ok: false,
        error: 'There is already one category with this title',
      });
    });
  });
  describe('Update category', function () {
    it('should update successfully.', async function () {
      categoryRepository.findOneBy.mockResolvedValueOnce({
        id: 1,
        title: 'category',
        image: DefaultImage,
      });
      categoryRepository.findOneBy.mockResolvedValueOnce(undefined);
      const response = await categoryService.updateOne({
        id: 1,
        title: 'updated',
        image: DefaultImage,
      });
      expect(response).toMatchObject({
        ok: true,
        error: null,
      });
    });
    it('should update fail it does not exist.', async function () {
      categoryRepository.findOneBy.mockResolvedValueOnce(undefined);
      categoryRepository.findOneBy.mockResolvedValueOnce({
        id: 1,
        title: 'category',
      });
      const response = await categoryService.updateOne({
        id: 1,
        title: 'updated',
        image: DefaultImage,
      });
      expect(response).toMatchObject({
        ok: false,
        error: 'There no category with this id',
      });
    });
    it('should update fail the title is already exist.', async function () {
      categoryRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: 'category',
      });
      categoryRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: 'category',
      });
      const response = await categoryService.updateOne({
        id: 1,
        title: 'updated',
        image: DefaultImage,
      });
      expect(response).toMatchObject({
        ok: false,
        error: 'There is already one category with this title',
      });
    });
  });
  describe('Delete category', function () {
    it('should delete successfully', async function () {
      categoryRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: 'category',
        image: DefaultImage,
      });
      const response = await categoryService.deleteOne(1);
      expect(response).toMatchObject({ ok: true, error: null });
    });
    it('should delete fail category does not exist', async function () {
      categoryRepository.findOneBy.mockResolvedValue(null);
      const response = await categoryService.deleteOne(1);
      expect(response).toMatchObject({
        ok: false,
        error: 'There is no category with this id',
      });
    });
  });
});
