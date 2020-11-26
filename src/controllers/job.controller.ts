import {
	Body,
	Controller,
	Delete,
	Inject,
	Param,
	Post, Put, Req, UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ObjectLiteral } from 'typeorm'
import { JobFilterDto, JobDto } from '../dto/job.dto'
import { JobService } from '../services/job.service'
import { Job } from '../entities/entity.job'
import { JwtAuthGuard } from '../services/auth/guards/jwt-auth.guard'
import {
	OptionalJobValidationPipe,
	RequiredJobValidationPipe,
} from '../pipes/job.validation.pipe'

@Controller('job')
export class JobController {
	@Inject()
	private readonly jobService: JobService

	@Post('find')
	@UsePipes(ValidationPipe)
	findOffers(@Body() filter: JobFilterDto): Promise<Job[]> {
		return this.jobService.findOffers(filter)
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	createOffer(@Req() { user }, @Body(RequiredJobValidationPipe) data: JobDto): Promise<ObjectLiteral> {
		return this.jobService.createOffer(user.id, data)
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard)
	updatedOffer(
		@Param() { id },
		@Body(OptionalJobValidationPipe) data: JobDto,
		@Req() { user },
	): Promise<JobDto> {
		return this.jobService.updatedOffer(id, user.id, data)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	deleteOffer(@Param() { id }, @Req() { user }): Promise<void> {
		return this.jobService.deleteOffer(id, user.id)
	}
}
