import { EntityRepository, ObjectLiteral, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { JobFeedDto, JobFeedFilterDto, UserFeedDto } from '../dto/feed.dto'
import { Feed } from '../entities/entity.feed'
import { FeedType } from '../app.interfaces'
import { City } from '../entities/entity.city'

@Injectable()
@EntityRepository(Feed)
export class FeedRepository extends Repository<Feed> {
	public publicAttributes = [
		'yearCommercialExp',
		'phone',
		'altPhone',
		'musicalInstrument',
		'name',
		'user',
		'address',
		'amount',
		'date',
		'musicalSets',
		'title',
		'extraInfo',
		'isActive',
		'type',
		'ownerId',
	]

	createFeed(data: JobFeedDto | UserFeedDto): Promise<ObjectLiteral> {
		return this.insert(Feed.create(data)).then(({ identifiers }) => identifiers)
	}

	async getFeeds(filters: JobFeedFilterDto, feedType: FeedType): Promise<Feed[]> {
		const feeds = await this.createQueryBuilder('feed')
			.select('feed.*, ST_AsGeoJSON(feed.location) as location')
			.from(City, 'city')
			.where(`city.name='${filters.city}'`)
			.andWhere(`feed.type='${feedType}'`)
			.andWhere('ST_Intersects(ST_SetSRID(feed.location, 4326), ST_SetSRID(city.location, 4326))')
			.execute()

		return feeds.map(feed => (
			feed.location ? { ...feed, location: JSON.parse(feed.location) } : feed
		))
	}
}