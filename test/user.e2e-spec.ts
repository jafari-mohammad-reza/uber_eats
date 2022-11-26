import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { appDataSource } from '../src/common/constants';
import { UserEntity } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('User Resolver (e2e)', () => {
  let app: INestApplication;
  let userEntityRepository: Repository<UserEntity>;
  beforeAll(async () => {
    userEntityRepository = await appDataSource.getRepository(UserEntity);
  });
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await appDataSource.dropDatabase();
    await app.close();
  });

  it('Register user', async () => {
    console.log(await userEntityRepository.find());
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation{ registerUser(input:{email:"mohammadrezajafari.dev@gmail.com" ,password:"Mohammad123",confirmPassword:"Mohammad123"}){
     ok
     error
   }}`,
      })
      .expect(200)
      .expect((res) => {
        console.log(res.body.data);
        expect(res.body.data.registerUser.ok).toBe(true);
        expect(res.body.data.registerUser.error).toBe(null);
      });
  });
});
