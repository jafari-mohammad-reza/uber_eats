import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export type MockRepositoryType<UserEntity> = Partial<
  Record<keyof Repository<UserEntity>, jest.Mock>
>;
