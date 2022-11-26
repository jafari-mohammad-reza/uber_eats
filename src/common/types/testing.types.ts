import { Repository } from 'typeorm';

export type MockRepositoryType<UserEntity> = Partial<
  Record<keyof Repository<UserEntity>, jest.Mock>
>;
