import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseInterface } from 'src/common/interfaces/response';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAccount } from './create-account.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async createAccount(accountData: CreateAccount): Promise<ResponseInterface> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values([accountData])
        .execute();
      return { status: 200, ok: true, msg: 'User Account Created' };
    } catch (e) {
      return { status: 400, ok: false, msg: e.detail };
    }
  }
}
