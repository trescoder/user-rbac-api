import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseInterface } from 'src/common/interfaces/response';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAccount } from './create-account.interface';
import * as bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async createAccount(accountData: CreateAccount): Promise<ResponseInterface> {
    // encrypt password before store
    accountData.password = await bcrypt.hash(accountData.password, salt);

    try {
      // creates the new account
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
