import { Column, Entity, ManyToOne } from 'typeorm'
import { BasicEntity, IBasic } from './entity.basic'
import { User } from './entity.user'
import { FeedType } from '../app.interfaces'
import assert = require('assert')

export interface IFeed extends IBasic {
	address?: string
	amount: number
	date?: Date
	musicalSets: number
	customer?: string
	extraInfo?: string
	owner: string
	title: string
	type: FeedType
	isActive: boolean
}

@Entity({ name: 'Feed' })
export class Feed extends BasicEntity implements IFeed {
	@Column({ type: 'varchar', length: 250, nullable: true })
	address: string

	@Column({ type: 'point', nullable: true })
	location: Geolocation

	@Column({ type: 'numeric', nullable: true, precision: 7, scale: 2 })
	amount: number

	@Column({ type: 'timestamp', nullable: true })
	date: Date

	@Column({ nullable: true, type: 'smallint' })
	musicalSets: number

	@ManyToOne(type => User, user => user.id)
	owner: string

	@ManyToOne(type => User, user => user.id)
	customer: string

	@Column({ type: 'varchar', length: 100 })
	title: string

	@Column({ type: 'text', nullable: true })
	extraInfo: string

	@Column({ type: 'boolean', default: true })
	isActive: boolean

	@Column({ enum: FeedType, type: 'varchar', length: 5 })
	type: FeedType

	static create(data) {
		assert(data, 'DTO is not provided')

		return Object.assign(new this(), data)
	}
}