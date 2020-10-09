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
import { FeedFilterDto, FeedDto } from '../dto/feed.dto'
import { FeedService } from './feed.service'
import { Feed } from '../entities/entity.feed'
import { LoggingInterceptor } from '../logging/logging.interceptor'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { FeedValidationPipe } from '../pipes/feed.validation.pipe'

@Controller('feed')
@UseInterceptors(LoggingInterceptor)
export class FeedController {
	@Inject()
	private readonly feedService: FeedService

	@Get()
	@UsePipes(ValidationPipe)
	getFeeds(@Query() filter: FeedFilterDto): Promise<Feed[]> {
		return this.feedService.getFeeds(filter)
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	createFeed(@Req() { user }, @Body(FeedValidationPipe) data: FeedDto): Promise<ObjectLiteral> {
		return this.feedService.createFeed(user.id, data)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	updateJobFeed(@Param() { id }, @Body(FeedValidationPipe) data: FeedDto): Promise<FeedDto> {
		return this.feedService.updatedFeed(id, data)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	deleteJobFeed(@Param() { id }): Promise<void> {
		return this.feedService.deleteFeed(id)
	}
}
