import { PrimaryGeneratedColumn, Column } from 'typeorm'
import { Instrument } from '../app.interfaces'

export interface IStats {
	yearCommercialExp: number
	countOfJobs: number
	countOfLikes: number
	countOfDisLikes: number
}

export interface IBasic {
	id: string
	created: string
	updated?: string
}

export interface IApp extends IStats {
	name?: string
	phone?: number
	altPhone?: number
	role?: Instrument
}

export abstract class Basic implements IBasic {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	created: string

	@Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
	updated: string
}

export abstract class AppEntity extends Basic implements IApp {
	@Column({ type: 'int', nullable: true })
	phone: number

	@Column({ type: 'int', nullable: true })
	altPhone: number

	@Column({ type: 'varchar', length: 30, enum: Instrument, nullable: true })
	role: Instrument

	@Column({ type: 'varchar', length: 80, nullable: true })
	name: string

	@Column({ type: 'smallint', nullable: true })
	yearCommercialExp: number

	@Column({ type: 'int', nullable: true })
	countOfJobs: number

	@Column({ type: 'int', nullable: true })
	countOfLikes: number

	@Column({ type: 'int', nullable: true })
	countOfDisLikes: number
}