import { EntityRepository, ObjectLiteral, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { MusicalReplacementDto, JobFilterDto, SelfPromotionDto } from '../dto/job.dto'
import { Job } from '../entities/entity.job'
import { City } from '../entities/entity.city'
import { InvalidArgumentsError } from '../lib/errors'
import { Instrument } from '../entities/entity.instrument'

@Injectable()
@EntityRepository(Job)
export class JobRepository extends Repository<Job> {
	protected getTableName(attr) {
		switch (attr) {
			case 'imageURL':
				return 'instrument'
			default:
				return 'job'
		}
	}

	protected parseLocation(job) {
		if (job.location) {
			job.location = JSON.parse(job.location)
		}

		return job
	}

	protected resolveProps(clientProps) {
		let props = 'job.*'

		if (clientProps) {
			props = clientProps.split(',')
				.map(attr => `${this.getTableName(attr)}."${attr}"`)
				.join(',')
		}

		if (props.includes('location')) {
			props = props.replace('job."location"', 'ST_AsGeoJSON(job.location) as location')
		}

		return props
	}

	async getOffers(filters: JobFilterDto): Promise<Job[]> {
		const props = this.resolveProps(filters.props)

		const query = await this.createQueryBuilder('job')
			.select(props)
			.where(`job.jobType='${filters.jobType}'`)

		if (filters.city) {
			query
				.from(City, 'city')
				.andWhere(`city.name='${filters.city}'`)
				.andWhere('ST_Intersects(ST_SetSRID(job.location, 4326), ST_SetSRID(city.location, 4326))')
		}

		if (props.includes('imageURL')) {
			query
				.from(Instrument, 'instrument')
				.andWhere('instrument.name=job.role')
		}

		const offers = await query.execute()
			.catch(e => {
				console.error(e.message)

				throw new InvalidArgumentsError('invalid filters')
			})

		return offers.map(this.parseLocation)
	}

	createOffer(data: MusicalReplacementDto | SelfPromotionDto): Promise<ObjectLiteral> {
		return this.insert(new Job(data))
			.then(({ identifiers: [identifier] }) => identifier)
	}
}