import { Test, TestingModule } from '@nestjs/testing';
import { MenueItemService } from './menue-item.service';

describe('MenueItemService', () => {
  let service: MenueItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenueItemService],
    }).compile();

    service = module.get<MenueItemService>(MenueItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
