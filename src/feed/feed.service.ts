import { Injectable } from '@nestjs/common'
import { BasicFeedDto, JobFeedDto, JobFeedFilterDto } from '../dto/feed.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { businessAssert, notFoundAssert } from '../lib/errors'
import { FeedRepository } from '../repository/feed.repository'
import { Feed } from '../entities/entity.feed'
import { ValidationUtils } from '../utils/validation'
import { FeedType } from '../app.interfaces'
import { isUUID } from 'class-validator'
import { OpenCage } from '../utils/geo'
import { CityRepository } from '../repository/city.repository'

@Injectable()
export class FeedService {
	constructor(
		@InjectRepository(FeedRepository)
		private jobFeedRepository: FeedRepository,
		@InjectRepository(CityRepository)
		private cityRepository: CityRepository,
	) {
	}

	getFeeds(filters: JobFeedFilterDto, type: FeedType) {
		return this.jobFeedRepository.getFeeds(filters, type)
	}

	async createFeed(data: JobFeedDto) {
		ValidationUtils.validateDTO(data, this.jobFeedRepository.publicAttributes)

		if (data.address) {
			const geoResponse = await OpenCage.geoCode({ address: data.address })

			businessAssert(geoResponse, 'Not valid address')

			Object.assign(data, geoResponse)
		}

		return this.jobFeedRepository.createFeed(data)
	}

	async updatedFeed(id: string, data: JobFeedDto | BasicFeedDto) {
		businessAssert(isUUID(id), `Not valid id: [${id}]`)

		ValidationUtils.validateDTO(data, this.jobFeedRepository.publicAttributes)

		const { affected } = await this.jobFeedRepository.update({ id }, Feed.create(data))

		notFoundAssert(affected, id)

		return data
	}

	async deleteFeed(id: string) {
		businessAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.jobFeedRepository.delete({ id })

		notFoundAssert(affected, id)
	}
}