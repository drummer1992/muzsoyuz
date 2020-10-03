import { Column, Entity, ManyToOne } from 'typeorm'
import { AppEntity, IApp } from './entity.basic'
import { User } from './entity.user'
import { FeedType } from '../app.interfaces'

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
		return Object.assign(new this(), data)
	}
}