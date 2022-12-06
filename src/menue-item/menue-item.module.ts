import { Module } from '@nestjs/common';
import { MenueItemService } from './menue-item.service';

@Module({
  providers: [MenueItemService]
})
export class MenueItemModule {}
