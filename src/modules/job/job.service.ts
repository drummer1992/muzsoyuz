import { Injectable } from '@nestjs/common'
import { JobFilterDto, JobDto } from '../../dto/job.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { argumentAssert, notFoundAssert } from '../../lib/errors'
import { JobRepository } from '../../repository/job.repository'
import { Job } from '../../entities/entity.job'
import { isUUID } from 'class-validator'
import { OpenCage } from '../../utils/geo'
import { CityRepository } from '../../repository/city.repository'
import { User } from '../../entities/entity.user'

@Injectable()
export class JobService {
	constructor(
		@InjectRepository(JobRepository)
		private jobRepository: JobRepository,
		@InjectRepository(CityRepository)
		private cityRepository: CityRepository,
	) {
	}

	getOffers(filters: JobFilterDto) {
		return this.jobRepository.getOffers(filters)
	}

	async createOffer(userId, data) {
		if (data.address || data.location) {
			Object.assign(data, await OpenCage.geoCode(data))
		}

		data.user = new User({ id: userId })

		return this.jobRepository.createOffer(data)
	}

	async updatedOffer(id: string, userId: string, data: JobDto) {
		argumentAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.jobRepository.update({
				id,
				user: new User({ id: userId }),
			},
			new Job(data),
		)

		notFoundAssert(affected, `Offer by id [${id}] not found`)

		return data
	}

	async deleteOffer(id: string, userId: string) {
		argumentAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.jobRepository.delete({ id, user: new User({ id: userId }) })

		notFoundAssert(affected, `Offer by id [${id}] not found`)
	}
}