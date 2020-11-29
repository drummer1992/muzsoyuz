import { EntityRepository, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Job } from '../entities/entity.job'

@Injectable()
@EntityRepository(Job)
export class JobRepository extends Repository<Job> {

}