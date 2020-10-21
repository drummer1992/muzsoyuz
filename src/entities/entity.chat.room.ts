import { Column, Entity } from 'typeorm'
import { Basic } from './entity.basic'

export interface IChatRoom {
	name: string
}

@Entity({ name: 'ChatRoom' })
export class ChatRoom extends Basic implements IChatRoom {
	@Column({ type: 'varchar' })
	name: string
}