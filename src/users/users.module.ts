import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersRepository } from './repository/users.repository'
import { UserController } from './users.controller'

@Module({
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  providers: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}
