import { Column, Entity, OneToMany } from 'typeorm'
import { Basic, IBasic } from './entity.basic'
import { Instruments } from '../app.interfaces'
import { ChatMessage } from './entity.chat-message'

interface IChat extends IBasic {
	roomId: string
	// messages: ChatMessage[]
}

@Entity({ name: 'Chat' })
export class Chat extends Basic implements IChat {
	@Column({ type: 'varchar', nullable: false })
	roomId: Instruments

	// @OneToMany(() => ChatMessage, chatMessage => chatMessage.chat)
	// messages: ChatMessage[]
}