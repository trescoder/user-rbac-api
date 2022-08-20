import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseInterface } from 'src/common/interfaces/response';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateAccount } from './create-account.interface';
import { hashPassword } from 'src/bcrypt-manager';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async createAccount(accountData: CreateAccount): Promise<ResponseInterface> {
    // encrypt password before store
    accountData.password = hashPassword(accountData.password);

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

  async findUser(email) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      return { user, ok: true };
    } catch (error) {
      return { error, ok: false };
    }
  }
}
