import { Column, Entity, OneToMany } from 'typeorm'
import { Basic } from './entity.basic'
import { Instruments } from '../app.interfaces'
import { Job } from './entity.job'

@Entity({ name: 'Instrument' })
export class Instrument extends Basic {
	@Column({ type: 'varchar', length: 15, enum: Instruments })
	name: Instruments

	@Column({ type: 'varchar', enum: Instruments })
	imageURL: string

	@OneToMany(() => Job, job => job.instrument)
	jobs: Job[]
}