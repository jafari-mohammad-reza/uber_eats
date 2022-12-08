import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { MockRepositoryType } from '../common/types/testing.types';
import { CategoryEntity } from '../category/category.entity';
import { RestaurantEntity } from './restaurant.entity';
import { CloudinaryService } from '../cloudinary/clodinary.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DefaultImage } from '../common/constants';
import { UserEntity } from '../users/user.entity';

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
  findAndCount: jest.fn(),
  delete: jest.fn(),
};
describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  let categoryRepository: MockRepositoryType<CategoryEntity>;
  let restaurantRepository: MockRepositoryType<RestaurantEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
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

    restaurantService = module.get<RestaurantService>(RestaurantService);
    categoryRepository = module.get(getRepositoryToken(CategoryEntity));
    restaurantRepository = module.get(getRepositoryToken(RestaurantEntity));
  });

  it('should be defined', () => {
    expect(restaurantService).toBeDefined();
  });
  it('should getAllRestaurants', async function () {
    restaurantRepository.find.mockResolvedValue([]);
    const response = await restaurantService.getAllRestaurants({
      take: 10,
      page: 1,
    });
    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(Array);
  });
  describe('Get restaurant by id', function () {
    it('should return restaurant', async function () {
      restaurantRepository.findOne.mockResolvedValue({
        id: 1,
        title: 'restaurant',
      });
      const response = await restaurantService.getRestaurantById(1);
      expect(response).toMatchObject({
        ok: true,
        restaurant: { id: 1, title: 'restaurant' },
        error: null,
      });
    });
    it('should return error restaurant not exist', async function () {
      restaurantRepository.findOne.mockResolvedValue(null);
      const response = await restaurantService.getRestaurantById(1);
      expect(response).toMatchObject({
        ok: false,
        restaurant: null,
        error: 'There is no restaurant with this id',
      });
    });
  });
  it('should getRestaurantsByTitle', async function () {
    restaurantRepository.findAndCount.mockResolvedValue([[], Number]);
    const response = await restaurantService.getRestaurantsByTitle({
      inputTitle: 'some title',
      page: 1,
      take: 10,
    });
    expect(response).toMatchObject({
      ok: true,
      restaurants: [],
      count: Number,
      error: null,
    });
  });
  describe('create new restaurant', function () {
    it('should create successfully.', async function () {
      restaurantRepository.findOneBy.mockResolvedValue(null);
      categoryRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: 'category',
      });
      const owner = new UserEntity();
      owner.id = 1;
      const response = await restaurantService.createRestaurant(
        {
          title: 'restaurant',
          coverImage: DefaultImage,
          address: 'address',
          category: 'category',
        },
        owner,
      );
      expect(response).toMatchObject({ ok: true, error: null });
    });
    it('should create fail restaurant title already exist.', async function () {
      restaurantRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: 'restaurant',
      });
      categoryRepository.findOneBy.mockResolvedValue({
        id: 1,
        title: 'category',
      });
      const owner = new UserEntity();
      owner.id = 1;
      const response = await restaurantService.createRestaurant(
        {
          title: 'restaurant',
          coverImage: DefaultImage,
          address: 'address',
          category: 'category',
        },
        owner,
      );
      expect(response).toMatchObject({
        ok: false,
        error: 'There already one restaurant with this title',
      });
    });
  });
  describe('update restaurant', function () {
    it('should update successfully.', async function () {
      restaurantRepository.findOne.mockResolvedValue({
        id: 1,
        title: 'restaurant',
        owner: {
          id: 1,
        },
      });
      let owner = new UserEntity();
      owner.id = 1;
      const response = await restaurantService.updateRestaurant(
        {
          title: 'updated restaurant',
          category: 'new category',
          id: 1,
        },
        owner,
      );
      expect(response).toMatchObject({
        ok: true,
        error: null,
      });
    });
    it('should update fail restaurant does not exist.', async function () {
      restaurantRepository.findOne.mockResolvedValue(null);
      let owner = new UserEntity();
      owner.id = 1;
      const response = await restaurantService.updateRestaurant(
        {
          title: 'updated restaurant',
          category: 'new category',
          id: 1,
        },
        owner,
      );
      expect(response).toMatchObject({
        ok: false,
        error: 'There is no restaurant with this id',
      });
    });
    it('should update fail wrong owner.', async function () {
      restaurantRepository.findOne.mockResolvedValue({
        id: 1,
        title: 'restaurant',
        owner: {
          id: 2,
        },
      });
      let owner = new UserEntity();
      owner.id = 1;
      const response = await restaurantService.updateRestaurant(
        {
          title: 'updated restaurant',
          category: 'new category',
          id: 1,
        },
        owner,
      );
      expect(response).toMatchObject({
        ok: false,
        error: 'You are not this restaurant owner',
      });
    });
  });
  describe('delete restaurant', function () {
    it('should delete successfully.', async function () {
      restaurantRepository.findOne.mockResolvedValue({
        id: 1,
        title: 'restaurant',
        owner: { id: 1 },
        coverImage: DefaultImage,
      });
      let owner = new UserEntity();
      owner.id = 1;
      const response = await restaurantService.deleteRestaurant(1, owner);
      expect(response).toMatchObject({
        ok: true,
        error: null,
      });
    });
    it('should delete fail wrong owner.', async function () {
      restaurantRepository.findOne.mockResolvedValue({
        id: 1,
        title: 'restaurant',
        owner: { id: 1 },
        coverImage: DefaultImage,
      });
      let owner = new UserEntity();
      owner.id = 2;
      const response = await restaurantService.deleteRestaurant(1, owner);
      expect(response).toMatchObject({
        ok: false,
        error: 'You are not this restaurant owner',
      });
    });
    it('should delete fail restaurant does not exist.', async function () {
      restaurantRepository.findOne.mockResolvedValue(null);
      let owner = new UserEntity();
      owner.id = 1;
      const response = await restaurantService.deleteRestaurant(1, owner);
      expect(response).toMatchObject({
        ok: false,
        error: 'There is no restaurant with this id',
      });
    });
  });
});
