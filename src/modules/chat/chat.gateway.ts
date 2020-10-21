import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'

@WebSocketGateway(80, { namespace: 'chat', transports: ['websocket'] })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server
	private logger: Logger = new Logger('AppGateway')

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, payload: string): void {
		client.broadcast.emit('msgToClient')
		this.server.emit('msgToClient', payload)
	}

	afterInit(server: Server): any {
		this.logger.log('Init')
	}

	handleDisconnect(client: Socket): any {
		this.logger.log(`Client disconnected: ${client.id}`)
	}

	handleConnection(client: Socket, ...args): any {
		this.logger.log(`Client connected: ${client.id}`)
	}
}