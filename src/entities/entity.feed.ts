import { Column, Entity, ManyToOne } from 'typeorm'
import { AppEntity, IApp } from './entity.basic'
import { User } from './entity.user'
import { FeedType } from '../app.interfaces'
import assert = require('assert')

export interface IFeed extends IApp {
	address?: string
	amount: number
	date?: Date
	musicalSets: number
	extraInfo?: string
	user: User
	title: string
	type: FeedType
	isActive: boolean
}

@Entity({ name: 'Feed' })
export class Feed extends AppEntity implements IFeed {
	@Column({ type: 'varchar', length: 250, nullable: true })
	address: string

	@Column({
		type: 'geometry',
		nullable: true,
		transformer: {
			to(location: any): any {
				return { type: 'Point', coordinates: [location.lng, location.lat] }
			},
			from(geoJson: any): any {
				return { lng: geoJson.coordinates[0], lat: geoJson.coordinates[1] }
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

	@ManyToOne(type => User, user => user.feeds)
	user: User

	@Column({ type: 'varchar', length: 100 })
	title: string

	@Column({ type: 'text', nullable: true })
	extraInfo: string

	@Column({ type: 'boolean', default: true })
	isActive: boolean

	@Column({ enum: FeedType, type: 'varchar', length: 30 })
	type: FeedType

	static create(data) {
		assert(data, 'DTO is not provided')

		return Object.assign(new this(), data)
	}
}