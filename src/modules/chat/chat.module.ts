import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatMessageRepository } from '../../repository/chat.message.repository'
import { ChatGateway } from './chat.gateway'
import { ChatRoomRepository } from '../../repository/chat.room.repository'

@Module({
	imports: [TypeOrmModule.forFeature([ChatMessageRepository, ChatRoomRepository])],
	providers: [ChatGateway],
})
export class ChatModule {

}