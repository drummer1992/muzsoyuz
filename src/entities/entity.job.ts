import { Column, Entity, ManyToOne } from 'typeorm'
import { AppEntity, IApp } from './entity.basic'
import { User } from './entity.user'
import { JobTypes } from '../app.interfaces'
import { Instrument } from './entity.instrument'

export interface IJob extends IApp {
	address?: string
	salary: number
	date?: Date
	sets: number
	extraInfo?: string
	user: User
	title: string
	jobType: JobTypes
	isActive: boolean
	city: string
	cityGeoCoded: string
	instrument: Instrument
}

@Entity({ name: 'Job' })
export class Job extends AppEntity implements IJob {
	@Column({ type: 'varchar', length: 250, nullable: true })
	address: string

	@Column({ type: 'varchar', length: 500, nullable: true })
	addressGeoCoded: string

	@Column({ type: 'varchar', length: 30, nullable: true })
	city: string

	@Column({ type: 'varchar', length: 30, nullable: true })
	cityGeoCoded: string

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

	@Column({ type: 'numeric', nullable: false, precision: 7, scale: 2 })
	salary: number

	@Column({ type: 'timestamp', nullable: false })
	date: Date

	@Column({ nullable: false, type: 'smallint' })
	sets: number

	@ManyToOne(() => User, user => user.jobs)
	user: User

	@Column({ type: 'varchar', length: 100 })
	title: string

	@Column({ type: 'text', nullable: true })
	extraInfo: string

	@Column({ type: 'boolean', default: true })
	isActive: boolean

	@Column({ enum: JobTypes, type: 'varchar', length: 30 })
	jobType: JobTypes

	@ManyToOne(() => Instrument, instrument => instrument.jobs)
	instrument: Instrument
}