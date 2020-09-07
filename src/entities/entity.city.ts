import { Column, Entity } from 'typeorm'

export interface ICity {
	name: string
	location: Geolocation
}

@Entity('City')
export class City implements ICity {
	@Column({ type: 'varchar', length: 80, nullable: true })
	name: string

	@Column({ type: 'polygon', nullable: true })
	location: Geolocation
}