import { PrimaryGeneratedColumn, Column } from 'typeorm'
import { Instruments } from '../app.interfaces'

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
	phone?: string
	altPhone?: string
	role?: Instruments
}

export abstract class Basic implements IBasic {
	constructor(data) {
		Object.assign(this, data)
	}

	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	created: string

	@Column({ type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
	updated: string
}

export abstract class AppEntity extends Basic implements IApp {
	@Column({ type: 'varchar', length: 30, nullable: true })
	phone: string

	@Column({ type: 'varchar', length: 30, nullable: true })
	altPhone: string

	@Column({ type: 'varchar', length: 30, enum: Instruments, nullable: true })
	role: Instruments

	@Column({ type: 'smallint', nullable: true })
	yearCommercialExp: number

	@Column({ type: 'int', nullable: true })
	countOfJobs: number

	@Column({ type: 'int', nullable: true })
	countOfLikes: number

	@Column({ type: 'int', nullable: true })
	countOfDisLikes: number
}