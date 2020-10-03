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
import { BasicFeedDto, MusicalReplacementDto, FeedFilterDto } from '../dto/feed.dto'
import { FeedService } from './feed.service'
import { Feed } from '../entities/entity.feed'
import { LoggingInterceptor } from '../logging/logging.interceptor'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('feed')
@UseInterceptors(LoggingInterceptor)
export class FeedController {
	@Inject()
	private readonly feedService: FeedService

	@Get('job')
	@UsePipes(ValidationPipe)
	getFeeds(@Query() filter: FeedFilterDto): Promise<Feed[]> {
		return this.feedService.getFeeds(filter)
	}

	@Post('job')
	@UseGuards(JwtAuthGuard)
	createFeed(@Req() { user }, @Body() data): Promise<ObjectLiteral> {
		return this.feedService.createFeed(user.id, data)
	}

	@Patch('job/:id')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	updateJobFeed(@Param() { id }, @Body() data): Promise<MusicalReplacementDto | BasicFeedDto> {
		return this.feedService.updatedFeed(id, data)
	}

	@Delete('job/:id')
	@UseGuards(JwtAuthGuard)
	deleteJobFeed(@Param() { id }): Promise<void> {
		return this.feedService.deleteFeed(id)
	}
}
