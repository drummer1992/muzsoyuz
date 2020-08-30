import { Module } from '@nestjs/common'
import { FeedController } from './feed.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FeedRepository } from './repository/feed.repository'
import { FeedService } from './feed.service'

@Module({
  imports: [TypeOrmModule.forFeature([FeedRepository])],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
