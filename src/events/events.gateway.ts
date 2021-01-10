import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { Inject, Logger, UseGuards } from '@nestjs/common'
import { CREATE_ROOM, GET_MESSAGES, JOIN_ROOM, JOINED_ROOM, LEAVE_ROOM, LEFT_ROOM, MESSAGE } from './constants'
import { WsAuthGuard } from '../services/auth/guards/ws-auth-guard'
import { ChatRepository } from '../repository/chat.repository'
import { ChatMessageRepository } from '../repository/chat-message.repository'
import { Chat } from '../entities/entity.chat'

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: /\/chat/gi })
export class EventsGateway implements OnGatewayConnection {
	@Inject()
	private chatRepository: ChatRepository
	@Inject()
	private chatMessageRepository: ChatMessageRepository

	@WebSocketServer()
	private wss: Server

	private logger: Logger = new Logger('ChatGateway')

	@SubscribeMessage(MESSAGE)
	handleMessage(
		client: Socket,
		message: { senderId: string, roomId: string, body: string },
	) {
		this.wss.to(message.roomId).emit(MESSAGE, message)
	}

	@SubscribeMessage(GET_MESSAGES)
	handleMessagesGet(client: any) {
		return this.chatMessageRepository.find({
			where: [
				{ senderId: client.user.id },
				{ receiverId: client.user.id },
			]
		})
	}

	@SubscribeMessage(CREATE_ROOM)
	async handleRoomCreate(client: Socket, room: string) {
		await this.chatRepository.insert(new Chat({ roomId: room }))

		client.join(room)
		client.emit(JOINED_ROOM, room)

		this.logger.log(`Client: ${client.id} created room: ${room}`)
	}

	@SubscribeMessage(JOIN_ROOM)
	handleRoomJoin(client: Socket, room: string) {
		client.join(room)
		client.emit(JOINED_ROOM, room)

		this.logger.log(`Client: ${client.id} joined to room: ${room}`)
	}

	@SubscribeMessage(LEAVE_ROOM)
	handleRoomLeave(client: Socket, room: string) {
		client.leave(room)
		client.emit(LEFT_ROOM, room)
	}

	handleConnection(client, ...args): any {
		this.logger.log(client.auth || 'auth -')
		this.logger.log(`Client connected: ${client.id}`)
	}
}
