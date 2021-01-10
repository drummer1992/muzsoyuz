import { EntityRepository, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Chat } from '../entities/entity.chat'

@Injectable()
@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {

}