import { Injectable } from '@nestjs/common'
import { JobFilterDto, UpdateJobDto, CreateJobDto, JobQueryDto } from '../controllers/dto/job.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { argumentAssert, notFoundAssert } from '../errors'
import { JobRepository } from '../repository/job.repository'
import { Job } from '../entities/entity.job'
import { isUUID } from 'class-validator'
import { User } from '../entities/entity.user'
import { InstrumentRepository } from '../repository/instrument.repository'

@Injectable()
export class JobService {
	constructor(
		@InjectRepository(JobRepository)
		private jobRepository: JobRepository,
		@InjectRepository(InstrumentRepository)
		private instrumentRepository: InstrumentRepository,
	) {
	}

	findOffers(filters: JobFilterDto) {
		const query: JobQueryDto = {
			where  : {
				isActive         : filters.isActive,
				'instrument.name': filters['instrument.name'],
				jobType          : filters.jobType,
				salary           : filters.salary,
				date             : filters.date,
				sets             : filters.sets,
			},
			limit  : filters.limit,
			offset : filters.offset,
			props  : filters.props,
			orderBy: filters.orderBy,
		}

		return this.jobRepository.find({
			relations: filters.relations || ['instrument'],
			join     : {
				alias             : 'job',
				innerJoinAndSelect: { instrument: 'job.instrument' },
			},
			where    : this.jobRepository.buildJobCriteria(query),
		})
	}

	async createOffer(userId, data: CreateJobDto) {
		const job = new Job(data)

		job.instrument = await this.instrumentRepository.findOne({
			where: { name: data.role },
		})

		job.user = new User({ id: userId })

		return this.jobRepository.save(job)
	}

	async updatedOffer(id: string, userId: string, data: UpdateJobDto) {
		argumentAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.jobRepository.update({
				id,
				user: new User({ id: userId }),
			},
			new Job(data),
		)

		notFoundAssert(affected, 'Order not found')

		return data
	}

	async deleteOffer(id: string, userId: string) {
		argumentAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.jobRepository.delete({ id, user: new User({ id: userId }) })

		notFoundAssert(affected, 'Order not found')
	}
}