import { Injectable } from '@nestjs/common'
import { BasicFeedDto, JobFeedDto } from '../dto/feed.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { businessAssert, notFoundAssert } from '../lib/errors'
import { FeedRepository } from './repository/feed.repository'
import { Feed } from '../entities/entity.feed'
import { ValidationUtils } from '../utils/validation'
import { FeedType } from '../app.interfaces'
import { isUUID } from 'class-validator'

@Injectable()
export class FeedService {
	constructor(
		@InjectRepository(FeedRepository)
		private jobFeedRepository: FeedRepository,
	) {}

	async getFeed(id: string, type: FeedType) {
		businessAssert(isUUID(id), `Not valid id: [${id}]`)

		const feed = await this.jobFeedRepository.findOne({ where: { id, type } })

		notFoundAssert(feed, id)

		return feed
	}

	getFeeds(type: FeedType) {
		return this.jobFeedRepository.find({
			where: { type }
		})
	}

	createFeed(data: JobFeedDto | BasicFeedDto) {
		ValidationUtils.validateDTO(data, this.jobFeedRepository.publicAttributes)

		return this.jobFeedRepository.createFeed(Feed.create(data))
	}

	async updatedFeed(id: string, data: JobFeedDto | BasicFeedDto) {
		businessAssert(isUUID(id), `Not valid id: [${id}]`)

		ValidationUtils.validateDTO(data, this.jobFeedRepository.publicAttributes)

		const { affected } = await this.jobFeedRepository.update({ id }, Feed.create(data))

		notFoundAssert(affected, id)
	}

	async deleteFeed(id: string) {
		businessAssert(isUUID(id), `Not valid id: [${id}]`)

		const { affected } = await this.jobFeedRepository.delete({ id })

		notFoundAssert(affected, id)
	}
}