import { Module } from '@nestjs/common';
import { UserModule } from './user.module'
import { EventsGateway } from '../events/events.gateway'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatRepository } from '../repository/chat.repository'
import { ChatMessageRepository } from '../repository/chat-message.repository'

@Module({
	providers: [EventsGateway],
	imports: [
		UserModule,
		JwtModule.register({
			secret     : process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
		}),
		TypeOrmModule.forFeature([
			ChatRepository,
			ChatMessageRepository,
		]),
	],
})
export class EventsModule {}