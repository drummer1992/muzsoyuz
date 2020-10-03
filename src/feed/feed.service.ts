import { Injectable } from '@nestjs/common'
import { BasicFeedDto, MusicalReplacementDto, FeedFilterDto } from '../dto/feed.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { businessAssert, notFoundAssert } from '../lib/errors'
import { FeedRepository } from '../repository/feed.repository'
import { Feed } from '../entities/entity.feed'
import { isUUID } from 'class-validator'
import { OpenCage } from '../utils/geo'
import { CityRepository } from '../repository/city.repository'

@Injectable()
export class FeedService {
	constructor(
		@InjectRepository(FeedRepository)
		private feedRepository: FeedRepository,
		@InjectRepository(CityRepository)
		private cityRepository: CityRepository,
	) {
	}

	getFeeds(filters: FeedFilterDto) {
		return this.feedRepository.getFeeds(filters)
	}

	async createFeed(userId, data) {
		Feed.validateDto(data)

		if (data.address) {
			const geoResponse = await OpenCage.geoCode({ address: data.address })

			Object.assign(data, {
				address        : data.address,
				addressGeoCoded: geoResponse?.address,
				location       : geoResponse?.location,
			})
		}

		return this.feedRepository.createFeed(data)
	}

	async updatedFeed(id: string, data: MusicalReplacementDto | BasicFeedDto) {
		businessAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.feedRepository.update({ id }, Feed.create(data))

		notFoundAssert(affected, id)

		return data
	}

	async deleteFeed(id: string) {
		businessAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.feedRepository.delete({ id })

		notFoundAssert(affected, id)
	}
}