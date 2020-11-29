import { PrimaryGeneratedColumn, Column } from 'typeorm'

export interface IBasic {
	id: string
	created: string
	updated?: string
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