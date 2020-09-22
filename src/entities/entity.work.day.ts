import { Column, Entity, ManyToOne } from 'typeorm'
import { Basic } from './entity.basic'
import { User } from './entity.user'

@Entity({ name: 'Workday' })
export class WorkDay extends Basic {
	@ManyToOne(() => User, user => user.id)
	user: string

	@Column({ type:'boolean' })
	dayOff: boolean

	@Column({ type: 'timestamp' })
	date: Date
}