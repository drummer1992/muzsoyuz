import { Injectable } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { ChatRoom } from '../entities/entity.chat.room'

@Injectable()
@EntityRepository(ChatRoom)
export class ChatRoomRepository extends Repository<ChatRoom> {

}