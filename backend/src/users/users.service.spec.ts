import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const usersRepository: Repository<User> = new Repository<User>();
    service = new UsersService(usersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
