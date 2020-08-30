import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Patch,
	Post,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ObjectLiteral } from 'typeorm'
import { JobFeedDto } from '../dto/feed.dto'
import { FeedService } from './feed.service'
import { Feed } from '../entities/entity.feed'
import { FeedType } from '../app.interfaces'
import { LoggingInterceptor } from '../logging/logging.interceptor'

@Controller('feed')
@UseInterceptors(LoggingInterceptor)
export class FeedController {
	@Inject()
	private readonly feedService: FeedService

	@Get('job/:id')
	getJobFeed(@Param() { id }): Promise<Feed> {
		return this.feedService.getFeed(id, FeedType.JOB)
	}

	@Get('job')
	getJobFeeds(): Promise<Feed[]> {
		return  this.feedService.getFeeds(FeedType.JOB)
	}

	@Post('job')
	@UsePipes(ValidationPipe)
	createJobFeed(@Body() data: JobFeedDto): Promise<ObjectLiteral> {
		return this.feedService.createFeed(data)
	}

	@Patch('job/:id')
	@UsePipes(ValidationPipe)
	updateJobFeed(@Param() { id }, @Body() data): Promise<void> {
		return this.feedService.updatedFeed(id, data)
	}

	@Delete('job/:id')
	deleteJobFeed(@Param() { id }): Promise<void> {
		return this.feedService.deleteFeed(id)
	}

	@Get('user')
	getUserFeed() {

	}

	@Get('user')
	getUserFeeds() {

	}

	@Post('user')
	createUserFeed() {

	}

	@Patch('user')
	updateUserFeed() {

	}
}
