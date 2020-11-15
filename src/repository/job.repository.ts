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
		const TABLE_BY_ATTRIBUTES_MAP = {
			imageURL: Instrument.name,
		}

		return TABLE_BY_ATTRIBUTES_MAP[attr] || Job.name
	}

	protected parseLocation(job) {
		if (job.location) {
			job.location = JSON.parse(job.location)
		}

		return job
	}

	protected resolveProps(clientProps) {
		let props = `${Job.name}.*`

		if (clientProps) {
			props = clientProps.split(',')
				.map(attr => `${this.getTableName(attr)}."${attr}"`)
				.join(',')
		}

		if (props.includes('location')) {
			props = props.replace(
				`${Job.name}."location"`,
				`ST_AsGeoJSON(${Job.name}.location) as location`,
			)
		}

		return props
	}

	async getOffers(filters: JobFilterDto): Promise<Job[]> {
		const props = this.resolveProps(filters.props)

		const query = await this.createQueryBuilder(Job.name)
			.select(props)
			.where(`${Job.name}.jobType='${filters.jobType}'`)

		if (filters.city) {
			query
				.from(City, City.name)
				.andWhere(`${City.name}.name='${filters.city}'`)
				.andWhere(`ST_Intersects(ST_SetSRID(${Job.name}.location, 4326), ST_SetSRID(${City.name}.location, 4326))`)
		}

		if (props.includes('imageURL')) {
			query
				.from(Instrument, Instrument.name)
				.andWhere(`${Instrument.name}.name=job.role`)
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