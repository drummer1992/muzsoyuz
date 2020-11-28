import { Module } from '@nestjs/common'
import { JobController } from '../controllers/job.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobRepository } from '../repository/job.repository'
import { JobService } from '../services/job.service'
import { InstrumentRepository } from '../repository/instrument.repository'

@Module({
	imports    : [
		TypeOrmModule.forFeature([
			JobRepository,
			InstrumentRepository,
		]),
	],
	providers  : [JobService],
	controllers: [JobController],
})
export class JobModule {
}
