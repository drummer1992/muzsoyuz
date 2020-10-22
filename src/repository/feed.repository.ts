import { EntityRepository, ObjectLiteral, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { MusicalReplacementDto, FeedFilterDto, SelfPromotionDto } from '../dto/feed.dto'
import { Feed } from '../entities/entity.feed'
import { City } from '../entities/entity.city'
import { InvalidArgumentsError } from '../lib/errors'
import { EntityInstrument } from '../entities/entity.instrument'

const parseLocation = feed => {
	if (feed.location) {
		feed.location = JSON.parse(feed.location)
	}

	return feed
}

@Injectable()
@EntityRepository(Feed)
export class FeedRepository extends Repository<Feed> {
	createFeed(data: MusicalReplacementDto | SelfPromotionDto): Promise<ObjectLiteral> {
		return this.insert(Feed.create(data)).then(({ identifiers: [identifier] }) => identifier)
	}

	async getFeeds(filters: FeedFilterDto): Promise<Feed[]> {
		let props = 'feed.*, location'

		if (filters.props) {
			filters.props = 'id,' + filters.props
			props = filters.props.split(',').map(attr => `feed."${attr}"`).join(',')

			if (props.includes('imageURL')) {
				props = props.replace('feed."imageURL"', 'instrument."imageURL"')
			}
		}

		props = props.replace('location', 'ST_AsGeoJSON(feed.location) as location')

		const query = await this.createQueryBuilder('feed')
			.select(props)
			.where(`feed.feedType='${filters.feedType}'`)

		if (filters.city) {
			query
				.from(City, 'city')
				.from(EntityInstrument, 'instrument')
				.andWhere(`city.name='${filters.city}'`)
				.andWhere('ST_Intersects(ST_SetSRID(feed.location, 4326), ST_SetSRID(city.location, 4326))')
				.andWhere('instrument.name=feed.role')
		}

		const feeds = await query.execute()
			.catch(e => {
				console.error(e.message)

				throw new InvalidArgumentsError('invalid filters')
			})

		return feeds.map(parseLocation)
	}
}