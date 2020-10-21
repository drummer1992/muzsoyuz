import { Column, Entity } from 'typeorm'
import { Basic } from './entity.basic'
import { Instrument } from '../app.interfaces'

@Entity({ name: 'Instrument' })
export class EntityInstrument extends Basic {
	@Column({ type: 'varchar', length: 15, enum: Instrument })
	name: Instrument

	@Column({ type: 'varchar', enum: Instrument })
	imageURL: string
}