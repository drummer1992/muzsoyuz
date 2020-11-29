import { Injectable } from '@nestjs/common'
import { JobFilterDto, UpdateJobDto, CreateJobDto } from '../controllers/dto/job.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { argumentAssert, notFoundAssert } from '../errors'
import { JobRepository } from '../repository/job.repository'
import { Job } from '../entities/entity.job'
import { isUUID } from 'class-validator'
import { User } from '../entities/entity.user'
import { InstrumentRepository } from '../repository/instrument.repository'
import { toArray } from '../utils/array'
import { Between, In, MoreThanOrEqual } from 'typeorm'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { trimTime, addDays } from '../utils/date'
import { omitBy } from '../utils/object'

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
		const { orderBy = 'created DESC', limit = 30, offset = 0 } = filters

		const [attr, direction = 'DESC'] = orderBy.split(' ')

		const buildCriteria = (qb: SelectQueryBuilder<Job>) => {
			const whereClause: any = {
				jobType : In(toArray(filters.jobType)),
				sets    : filters.sets,
				isActive: filters.isActive,
				salary  : filters.salary
					? MoreThanOrEqual(filters.salary)
					: undefined,
			}

			if (filters.date) {
				const date = trimTime(new Date(filters.date))

				whereClause.date = Between(date, addDays(date, 1))
			}

			qb.where(omitBy(whereClause))

			if (filters.role) {
				qb.andWhere(
					'instrument.name IN (:...name)',
					{ name: toArray(filters.role) },
				)
			}
		}

		const options: FindManyOptions<Job> = {
			relations: (filters.relations || []) as any,
			join     : { alias: 'job', innerJoinAndSelect: { instrument: 'job.instrument' } },
			where    : buildCriteria,
			order    : { [attr]: direction },
			take     : limit < 100 ? limit : 30,
			skip     : offset,
		}

		return this.jobRepository.find(options)
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