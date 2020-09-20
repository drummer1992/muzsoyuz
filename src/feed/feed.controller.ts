import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Patch,
	Post, Query, Req, UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ObjectLiteral } from 'typeorm'
import { BasicFeedDto, JobFeedDto, JobFeedFilterDto } from '../dto/feed.dto'
import { FeedService } from './feed.service'
import { Feed } from '../entities/entity.feed'
import { FeedType } from '../app.interfaces'
import { LoggingInterceptor } from '../logging/logging.interceptor'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('feed')
@UseInterceptors(LoggingInterceptor)
export class FeedController {
	@Inject()
	private readonly feedService: FeedService

	@Get('job')
	@UsePipes(ValidationPipe)
	getJobFeeds(@Query() filter: JobFeedFilterDto): Promise<Feed[]> {
		return this.feedService.getFeeds(filter, FeedType.MUSICAL_REPLACEMENT)
	}

	@UseGuards(JwtAuthGuard)
	@Post('job')
	@UsePipes(ValidationPipe)
	createJobFeed(@Req() { user }, @Body() data: JobFeedDto): Promise<ObjectLiteral> {
		return this.feedService.createFeed(Object.assign(data, { user: user.id }))
	}

	@UseGuards(JwtAuthGuard)
	@Patch('job/:id')
	@UsePipes(ValidationPipe)
	updateJobFeed(@Param() { id }, @Body() data): Promise<JobFeedDto | BasicFeedDto> {
		return this.feedService.updatedFeed(id, data)
	}

	@UseGuards(JwtAuthGuard)
	@Delete('job/:id')
	deleteJobFeed(@Param() { id }): Promise<void> {
		return this.feedService.deleteFeed(id)
	}
}
