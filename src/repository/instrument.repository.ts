import { EntityRepository, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Instrument } from '../entities/entity.instrument'

@Injectable()
@EntityRepository(Instrument)
export class InstrumentRepository extends Repository<Instrument> {

}