import { Injectable } from '@nestjs/common'
import { JobFilterDto, JobDto } from '../dto/job.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { argumentAssert, notFoundAssert } from '../errors'
import { JobFindManyOptions, JobRepository } from '../repository/job.repository'
import { Job } from '../entities/entity.job'
import { isUUID } from 'class-validator'
import { User } from '../entities/entity.user'
import { InstrumentRepository } from '../repository/instrument.repository'
import { FindConditions, In } from 'typeorm'
import { ArrayUtils } from '../utils/array'

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
		const jobType = In(ArrayUtils.toArray(filters.jobType))

		const { orderBy = 'created DESC', limit = 30, offset = 0 } = filters

		const [attr, direction = 'DESC'] = orderBy.split(' ')

		const findCondition: FindConditions<Job> = { jobType }

		const options: JobFindManyOptions = {
			relations: ['instrument', 'user'],
			where    : [findCondition],
			order    : { [attr]: direction },
			take     : limit < 100 ? limit : 30,
			skip     : offset,
		}

		if (filters.role) {
			findCondition.role = In(ArrayUtils.toArray(filters.role))
		}

		return this.jobRepository.find(options)
	}

	async createOffer(userId, data: JobDto) {
		const job = new Job(data)

		job.instrument = await this.instrumentRepository.findOne({
			where: { name: data.role },
		})

		job.user = new User({ id: userId })

		return this.jobRepository.save(job)
	}

	async updatedOffer(id: string, userId: string, data: JobDto) {
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