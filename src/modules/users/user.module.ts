import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '../../repository/user.repository'
import { UserController } from './user.controller'
import { WorkdayRepository } from '../../repository/workday.repository'

@Module({
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([UserRepository, WorkdayRepository])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
