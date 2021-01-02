import {
	OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('EventsGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(socket: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${socket.id}`);

		const { roomId } = socket.handshake.query

		this.logger.log(`Room Id: ${roomId}`);

		socket.join(roomId)

		socket.on('newChatMessage', (data) => {
			this.server.in(roomId).emit('newChatMessage', data);
		});

		// Leave the room if the user closes the socket
		socket.on("disconnect", () => {
			socket.leave(roomId);
		});
	}

	@SubscribeMessage('newChatMessage')
	async onChat(client, message){
		this.logger.log(`Client newChatMessage : ${client.id}`);

		client.broadcast.emit('newChatMessage', message);
	}
}