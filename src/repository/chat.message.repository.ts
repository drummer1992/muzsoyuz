import { Injectable } from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import { ChatMessage } from '../entities/entity.chat.message'

@Injectable()
@EntityRepository(ChatMessage)
export class ChatMessageRepository extends Repository<ChatMessage> {

}