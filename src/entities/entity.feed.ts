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
	@Column({ nullable: true })
	address: string

	@Column({ nullable: true })
	amount: number

	@Column({ nullable: true })
	date: Date

	@Column({ nullable: true })
	musicalSets: number

	@ManyToOne(type => User, user => user.id)
	owner: string

	@ManyToOne(type => User, user => user.id)
	customer: string

	@Column()
	title: string

	@Column({ nullable: true })
	extraInfo: string

	@Column({ default: true })
	isActive: boolean

	@Column({ enum: FeedType })
	type: FeedType

	static create(data) {
		assert(data, 'DTO is not provided')

		return Object.assign(new this(), data)
	}
}