import { EntityRepository, Repository } from 'typeorm'
import { WorkDay } from '../entities/entity.work.day'
import { Injectable } from '@nestjs/common'

@Injectable()
@EntityRepository(WorkDay)
export class WorkdayRepository extends Repository<WorkDay> {

}