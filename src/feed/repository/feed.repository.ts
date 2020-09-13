import { EntityRepository, ObjectLiteral, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { JobFeedDto, JobFeedFilterDto, UserFeedDto } from '../../dto/feed.dto'
import { Feed } from '../../entities/entity.feed'
import { FeedType } from '../../app.interfaces'

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

	getFeeds(filters: JobFeedFilterDto, feedType: FeedType): Promise<Feed[]> {
		// TODO: geoCoded city, and retrieve feeds by polygon

		return this.find({
			where: {
				type             : feedType,
				musicalInstrument: filters.musicalInstrument,
			},
		})
	}
}