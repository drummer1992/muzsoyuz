import { Column, Entity } from 'typeorm'
import { Basic } from './entity.basic'

export interface ICity {
	name: string
	location: object
}

@Entity({ name: 'City' })
export class City extends Basic implements ICity {
	@Column({ type: 'varchar', length: 80, nullable: true })
	name: string

	@Column({ type: 'geometry', nullable: true })
	location: object
}