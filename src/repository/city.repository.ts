import { EntityRepository, Repository } from 'typeorm'
import { City } from '../entities/entity.city'
import { Injectable } from '@nestjs/common'

@Injectable()
@EntityRepository(City)
export class CityRepository extends Repository<City> {

}