import { Column, Entity, OneToMany } from 'typeorm'
import { Basic, IBasic } from './entity.basic'
import { Instruments } from '../app.interfaces'
import { Job } from './entity.job'

interface IInstrument extends IBasic {
	name: Instruments
	imageURL: string
	jobs: Job[]
}

@Entity({ name: 'Instrument' })
export class Instrument extends Basic implements IInstrument {
	@Column({ type: 'varchar', length: 15, enum: Instruments })
	name: Instruments

	@Column({ type: 'varchar', enum: Instruments })
	imageURL: string

	@OneToMany(() => Job, job => job.instrument)
	jobs: Job[]
}