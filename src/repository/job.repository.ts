import { EntityRepository, FindConditions, FindManyOptions, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Job } from '../entities/entity.job'

export interface JobFindManyOptions extends FindManyOptions<Job> {
	where: FindConditions<Job>[]
}

@Injectable()
@EntityRepository(Job)
export class JobRepository extends Repository<Job> {

}