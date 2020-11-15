import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post, Put, Query, Req, UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ObjectLiteral } from 'typeorm'
import { JobFilterDto, JobDto } from '../../dto/job.dto'
import { JobService } from './job.service'
import { Job } from '../../entities/entity.job'
import { LoggingInterceptor } from '../../logging/logging.interceptor'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import {
	OptionalJobValidationPipe,
	RequiredJobValidationPipe,
} from '../../pipes/job.validation.pipe'

@Controller('job')
@UseInterceptors(LoggingInterceptor)
export class JobController {
	@Inject()
	private readonly jobService: JobService

	@Get()
	@UsePipes(ValidationPipe)
	getOffers(@Query() filter: JobFilterDto): Promise<Job[]> {
		return this.jobService.getOffers(filter)
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	createOffer(@Req() { user }, @Body(RequiredJobValidationPipe) data: JobDto): Promise<ObjectLiteral> {
		return this.jobService.createOffer(user.id, data)
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard)
	updatedOffer(@Param() { id }, @Body(OptionalJobValidationPipe) data: JobDto, @Req() { user }): Promise<JobDto> {
		return this.jobService.updatedOffer(id, user.id, data)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	deleteOffer(@Param() { id }, @Req() { user }): Promise<void> {
		return this.jobService.deleteOffer(id, user.id)
	}
}
