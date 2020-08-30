import { EntityRepository, ObjectLiteral, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { JobFeedDto, UserFeedDto } from '../../dto/feed.dto'
import { Feed } from '../../entities/entity.feed'

@Injectable()
@EntityRepository(Feed)
export class FeedRepository extends Repository<Feed> {
	public publicAttributes = [
		'yearCommercialExp',
		'phone',
		'altPhone',
		'musicalInstrument',
		'imageUrl',
		'firstName',
		'lastName',
		'address',
		'amount',
		'date',
		'musicalSets',
		'title',
		'extraInfo',
		'isActive',
		'type',
	]

	createFeed(data: JobFeedDto | UserFeedDto): Promise<ObjectLiteral> {
		return this.insert(Feed.create(data)).then(({ identifiers }) => identifiers)
	}
}