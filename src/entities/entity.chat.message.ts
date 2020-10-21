import { Column, Entity, ManyToOne } from 'typeorm'
import { User } from './entity.user'
import { Basic } from './entity.basic'
import { ChatRoom } from './entity.chat.room'

export interface IChatMessage {
	user: string,
	message: string
}

@Entity({ name: 'ChatMessage' })
export class ChatMessage extends Basic implements IChatMessage {
	@ManyToOne(() => User, user => user.id)
	user: string

	@ManyToOne(() => ChatRoom)
	room: string

	@Column({ type: 'varchar', length: 500 })
	message: string
}