import { Module } from '@nestjs/common'
import { FeedController } from './feed.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FeedRepository } from '../repository/feed.repository'
import { FeedService } from './feed.service'
import { CityRepository } from '../repository/city.repository'

@Module({
  imports: [TypeOrmModule.forFeature([FeedRepository, CityRepository])],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
