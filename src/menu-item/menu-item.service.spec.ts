import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemService } from './menu-item.service';
import { CloudinaryService } from '../cloudinary/clodinary.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuItemEntity } from './menu-item.entity';
import { MockRepositoryType } from '../common/types/testing.types';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

const mockRestaurantRepository = {
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  count: jest.fn(),
};
const mockMenuItemRepository = {
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  count: jest.fn(),
};
describe('MenuItemService', () => {
  let service: MenuItemService;
  let menuItemRepository: MockRepositoryType<MenuItemEntity>;
  let restaurantRepository: MockRepositoryType<RestaurantEntity>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuItemService,
        CloudinaryService,
        {
          provide: getRepositoryToken(MenuItemEntity),
          useValue: mockMenuItemRepository,
        },
        {
          provide: getRepositoryToken(RestaurantEntity),
          useValue: mockRestaurantRepository,
        },
      ],
    }).compile();

    service = module.get<MenuItemService>(MenuItemService);
    menuItemRepository = module.get(getRepositoryToken(MenuItemEntity));
    restaurantRepository = module.get(getRepositoryToken(RestaurantEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
