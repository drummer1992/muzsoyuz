import { Column, Entity, ManyToOne } from 'typeorm'
import { Basic } from './entity.basic'
import { User } from './entity.user'

export interface IWorkDay {
	user: string
	dayOff: boolean
	date: Date
}

@Entity({ name: 'Workday' })
export class WorkDay extends Basic implements IWorkDay {
	@ManyToOne(() => User, user => user.id)
	user: string

	@Column({ type: 'boolean' })
	dayOff: boolean

	@Column({ type: 'timestamp' })
	date: Date
}