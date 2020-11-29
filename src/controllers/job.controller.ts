import {
	Body,
	Controller,
	Delete, HttpCode, HttpStatus,
	Inject,
	Param,
	Post, Put, Req, UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { JobFilterDto, UpdateJobDto, CreateJobDto } from './dto/job.dto'
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
	@HttpCode(HttpStatus.OK)
	findOffers(@Body() filter: JobFilterDto): Promise<Job[]> {
		return this.jobService.findOffers(filter)
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	createOffer(
		@Req() { user },
		@Body(RequiredJobValidationPipe) data: CreateJobDto,
	): Promise<Job> {
		return this.jobService.createOffer(user.id, data)
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard)
	updatedOffer(
		@Param() { id },
		@Body(OptionalJobValidationPipe) data: UpdateJobDto,
		@Req() { user },
	): Promise<UpdateJobDto> {
		return this.jobService.updatedOffer(id, user.id, data)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	deleteOffer(@Param() { id }, @Req() { user }): Promise<void> {
		return this.jobService.deleteOffer(id, user.id)
	}
}
