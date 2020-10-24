import { Module } from '@nestjs/common'
import { JobController } from './job.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobRepository } from '../../repository/job.repository'
import { JobService } from './job.service'
import { CityRepository } from '../../repository/city.repository'

@Module({
  imports: [TypeOrmModule.forFeature([JobRepository, CityRepository])],
  providers: [JobService],
  controllers: [JobController],
})
export class JobModule {}
