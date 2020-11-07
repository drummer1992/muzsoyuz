import { Injectable } from '@nestjs/common'
import { JobFilterDto, JobDto } from '../../dto/job.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { argumentAssert, notFoundAssert } from '../../lib/errors'
import { JobRepository } from '../../repository/job.repository'
import { Job } from '../../entities/entity.job'
import { isUUID } from 'class-validator'
import { OpenCage } from '../../utils/geo'
import { CityRepository } from '../../repository/city.repository'

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
		data.address && Object.assign(data, await OpenCage.geoCode(data))

		return this.jobRepository.createOffer(data)
	}

	async updatedOffer(id: string, data: JobDto) {
		argumentAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.jobRepository.update({ id }, new Job(data))

		notFoundAssert(affected, id)

		return data
	}

	async deleteOffer(id: string) {
		argumentAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.jobRepository.delete({ id })

		notFoundAssert(affected, id)
	}
}