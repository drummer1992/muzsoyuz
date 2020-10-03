import { Column, Entity, ManyToOne } from 'typeorm'
import { AppEntity, IApp } from './entity.basic'
import { User } from './entity.user'
import { FeedType } from '../app.interfaces'
import { FeedValidator } from '../custom-validators/feed.validator'
import { argumentAssert } from '../lib/errors'

const BASIC_FEED_VALIDATORS = {
	title            : FeedValidator.title,
	extraInfo        : FeedValidator.extraInfo,
	musicalInstrument: FeedValidator.musicalInstrument,
}

const MUSICAL_REPLACEMENT_VALIDATION_MAP = {
	address    : FeedValidator.address,
	amount     : FeedValidator.amount,
	date       : FeedValidator.date,
	musicalSets: FeedValidator.musicalSets,
	...BASIC_FEED_VALIDATORS,
}

const SELF_PROMOTION_VALIDATION_MAP = {
	...BASIC_FEED_VALIDATORS,
}

const JOB_VALIDATION_MAP = {}

export interface IFeed extends IApp {
	address?: string
	amount: number
	date?: Date
	musicalSets: number
	extraInfo?: string
	user: User
	title: string
	feedType: FeedType
	isActive: boolean
}

@Entity({ name: 'Feed' })
export class Feed extends AppEntity implements IFeed {
	@Column({ type: 'varchar', length: 250, nullable: true })
	address: string

	@Column({ type: 'varchar', length: 500, nullable: true })
	addressGeoCoded: string

	@Column({
		type       : 'geometry',
		nullable   : true,
		transformer: {
			to(location: any): any {
				return location && { type: 'Point', coordinates: [location.lng, location.lat] }
			},
			from(geoJson: any): any {
				return geoJson && { lng: geoJson.coordinates[0], lat: geoJson.coordinates[1] }
			},
		},
	})
	location: any

	@Column({ type: 'numeric', nullable: true, precision: 7, scale: 2 })
	amount: number

	@Column({ type: 'timestamp', nullable: true })
	date: Date

	@Column({ nullable: true, type: 'smallint' })
	musicalSets: number

	@ManyToOne(() => User, user => user.feeds)
	user: User

	@Column({ type: 'varchar', length: 100 })
	title: string

	@Column({ type: 'text', nullable: true })
	extraInfo: string

	@Column({ type: 'boolean', default: true })
	isActive: boolean

	@Column({ enum: FeedType, type: 'varchar', length: 30 })
	feedType: FeedType

	static create(data) {
		argumentAssert(data, 'DTO is not provided')

		return Object.assign(new this(), data)
	}

	static validateDto(dto) {
		argumentAssert(dto, 'Data is empty')

		const VALIDATION_MAP_BY_FEED_TYPE = {
			[FeedType.MUSICAL_REPLACEMENT]: MUSICAL_REPLACEMENT_VALIDATION_MAP,
			[FeedType.SELF_PROMOTION]     : SELF_PROMOTION_VALIDATION_MAP,
			[FeedType.JOB]                : JOB_VALIDATION_MAP,
		}

		argumentAssert(FeedValidator.feedType.validate(dto.feedType), FeedValidator.feedType.message(dto.feedType))

		const VALIDATION_MAP = VALIDATION_MAP_BY_FEED_TYPE[dto.feedType]

		Object.keys(VALIDATION_MAP).forEach(attribute => {
			const validator = VALIDATION_MAP[attribute]

			argumentAssert(validator.validate(dto[attribute]), validator.message(dto[attribute]))
		})
	}
}