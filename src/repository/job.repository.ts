import { EntityRepository, ObjectLiteral, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { MusicalReplacementDto, JobFilterDto, SelfPromotionDto } from '../dto/job.dto'
import { Job } from '../entities/entity.job'
import { City } from '../entities/entity.city'
import { InvalidArgumentsError } from '../lib/errors'
import { Instrument } from '../entities/entity.instrument'
import { TABLES } from '../app.interfaces'

@Injectable()
@EntityRepository(Job)
export class JobRepository extends Repository<Job> {
	protected getTableName(attr) {
		const TABLE_BY_ATTRIBUTES_MAP = {
			imageURL: TABLES.INSTRUMENT,
		}

		return TABLE_BY_ATTRIBUTES_MAP[attr] || TABLES.JOB
	}

	protected parseLocation(job) {
		if (job.location) {
			job.location = JSON.parse(job.location)
		}

		return job
	}

	protected resolveProps(clientProps) {
		let props = `${TABLES.JOB}.*`

		if (clientProps) {
			props = clientProps.split(',')
				.map(attr => `${this.getTableName(attr)}."${attr}"`)
				.join(',')
		}

		if (props.includes('location')) {
			props = props.replace(
				`${TABLES.JOB}."location"`,
				`ST_AsGeoJSON(${TABLES.JOB}.location) as location`,
			)
		}

		return props
	}

	async getOffers(filters: JobFilterDto): Promise<Job[]> {
		const props = this.resolveProps(filters.props)

		const query = await this.createQueryBuilder(TABLES.JOB)
			.select(props)
			.where(`${TABLES.JOB}.jobType='${filters.jobType}'`)

		if (filters.city) {
			query
				.from(City, TABLES.CITY)
				.andWhere(`${TABLES.CITY}.name='${filters.city}'`)
				.andWhere(`ST_Intersects(ST_SetSRID(${TABLES.JOB}.location, 4326), ST_SetSRID(${TABLES.CITY}.location, 4326))`)
		}

		if (props.includes('imageURL')) {
			query
				.from(Instrument, TABLES.INSTRUMENT)
				.andWhere(`${TABLES.INSTRUMENT}.name=job.role`)
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