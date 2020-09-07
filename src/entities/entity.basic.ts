import { PrimaryGeneratedColumn, Column } from 'typeorm'
import { Instrument } from '../app.interfaces'

export interface IStats {
	yearCommercialExp: number
	countOfJobs: number
	countOfLikes: number
	countOfDisLikes: number
}

export interface IBasic extends IStats {
	id: string
	created: string
	updated?: string
	name?: string
	phone?: number
	altPhone?: number
	musicalInstrument?: Instrument
}

export abstract class Stats implements IStats {
	@Column({ nullable: true })
	yearCommercialExp: number

	@Column({ nullable: true })
	countOfJobs: number

	@Column({ nullable: true })
	countOfLikes: number

	@Column({ nullable: true })
	countOfDisLikes: number
}

export abstract class BasicEntity extends Stats implements IBasic {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	created: string

	@Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
	updated: string

	@Column({ type: 'int', nullable: true })
	phone: number

	@Column({ type: 'int', nullable: true })
	altPhone: number

	@Column({ type: 'varchar', length: 30, enum: Instrument, nullable: true })
	musicalInstrument: Instrument

	@Column({ type: 'varchar', length: 80, nullable: true })
	name: string
}