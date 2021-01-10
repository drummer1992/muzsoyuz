import { Column, Entity, ManyToOne } from 'typeorm'
import { Basic, IBasic } from './entity.basic'
import { Chat } from './entity.chat'

interface IChatMessage extends IBasic {
	// chat: Chat
	message: string
	senderId: string
	receiverId: string
}

@Entity({ name: 'ChatMessage' })
export class ChatMessage extends Basic implements IChatMessage {
	// @ManyToOne(() => Chat, chat => chat.id)
	// chat: Chat

	@Column({ type: 'varchar' })
	message: string

	@Column({ type: 'varchar' })
	senderId: string

	@Column({ type: 'varchar' })
	receiverId: string
}