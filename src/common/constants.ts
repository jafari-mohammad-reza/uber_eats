import { DataSource } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

export const appDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  synchronize: process.env.NODE_ENV !== 'prod',
  entities: [UserEntity],
});
