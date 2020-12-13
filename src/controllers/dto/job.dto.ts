import { IsBoolean, IsIn, IsOptional } from 'class-validator'
import { DbQueryDto, RangeDto } from './common.dto'
import { JobTypes, Instruments } from '../../app.interfaces'
import { IsArrayOf } from '../../validators/array-of-string'
import { IsRange } from '../../validators/range'

export class JobFilterDto extends DbQueryDto {
	@IsOptional()
	@IsArrayOf(Object.values(Instruments))
	role: string | string[]

	@IsArrayOf(Object.values(JobTypes))
	jobType: string | string[]

	@IsOptional()
	@IsRange()
	salary: RangeDto

	@IsOptional()
	@IsRange()
	date: RangeDto

	@IsOptional()
	@IsIn([1, 2, 3, 4, 5])
	sets: number

	@IsOptional()
	@IsBoolean()
	isActive: boolean
}

export class JobQueryDto extends DbQueryDto {
	where: {
		role?: string | string[]
		jobType?: string | string[]
		salary?: RangeDto | number
		date?: RangeDto | number | string
		sets?: RangeDto | number
		isActive?: boolean
	}
}

export class UpdateJobDto {
	extraInfo?: string
	title: string
	address: string
	salary: number
	date: Date
	sets: number
}

export class CreateJobDto {
	title: string
	jobType: string
	role: Instruments
	address: string
	salary: number
	date: Date
	sets: number
}