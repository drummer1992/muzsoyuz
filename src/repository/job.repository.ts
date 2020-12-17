import { Between, EntityRepository, In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Job } from '../entities/entity.job'
import { mappers, resolveRange } from '../utils/sql'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { toArray } from '../utils/array'
import { addDays, trimTime } from '../utils/date'
import { omitBy } from '../utils/object'
import { JobQueryDto } from '../controllers/dto/job.dto'

const mapByTableName = mappers.byTableName('job')

@Injectable()
@EntityRepository(Job)
export class JobRepository extends Repository<Job> {
	getTablePrefix(arg) {
		return mapByTableName(arg)
	}

	buildJobCriteria(query: JobQueryDto) {
		const { orderBy = 'created', offset = 0, limit = 30 } = query
		const { where = {}, props = [] } = query

		const [attr = 'created', direction = 'DESC'] = orderBy.split(' ')

		return (qb: SelectQueryBuilder<Job>) => {
			const whereClause: any = {
				sets    : where.sets,
				isActive: where.isActive,
			}

			if (where.jobType) {
				whereClause.jobType = In(toArray(where.jobType))
			}

			if (where.salary) {
				const salary = resolveRange(where.salary)

				whereClause.salary = Between(
					salary.from || 0,
					salary.to || Number.MAX_SAFE_INTEGER,
				)
			}

			if (where.date) {
				const now = Date.now()

				const date = resolveRange(where.date)

				const from = date.from || now
				const to = date.to || now

				whereClause.date = Between(
					trimTime(from),
					trimTime(addDays(to, 1.5)),
				)
			}

			qb.where(omitBy(whereClause))
			qb.offset(offset)
			qb.orderBy(this.getTablePrefix(attr), direction.toLowerCase() as any)
			qb.limit(limit)

			if (props.length) {
				qb.select(props.map(this.getTablePrefix))
			}

			if (where['instrument.name']) {
				qb.andWhere(
					'instrument.name IN (:...name)',
					{ name: toArray(where['instrument.name']) },
				)
			}
		}
	}
}