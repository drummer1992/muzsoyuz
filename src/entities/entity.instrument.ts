import { Column, Entity } from 'typeorm'
import { Basic } from './entity.basic'
import { Instruments } from '../app.interfaces'

@Entity({ name: 'Instrument' })
export class Instrument extends Basic {
	@Column({ type: 'varchar', length: 15, enum: Instruments })
	name: Instruments

	@Column({ type: 'varchar', enum: Instruments })
	imageURL: string
}