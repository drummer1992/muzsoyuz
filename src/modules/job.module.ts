import { Module } from '@nestjs/common'
import { JobController } from '../controllers/job.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobRepository } from '../repository/job.repository'
import { JobService } from '../services/job.service'
import { CityRepository } from '../repository/city.repository'
import { InstrumentRepository } from '../repository/instrument.repository'

@Module({
	imports    : [
		TypeOrmModule.forFeature([
			JobRepository,
			CityRepository,
			InstrumentRepository,
		]),
	],
	providers  : [JobService],
	controllers: [JobController],
})
export class JobModule {
}
