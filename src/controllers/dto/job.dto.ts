import { IsBoolean, IsDateString, IsIn, IsOptional } from 'class-validator'
import { DbQueryDto } from './common.dto'
import { JobTypes, Instruments } from '../../app.interfaces'
import { IsArrayOf } from '../../validators/array-of-string'

export class JobFilterDto extends DbQueryDto {
	@IsOptional()
	@IsArrayOf(Object.values(Instruments))
	role: string

	@IsArrayOf(Object.values(JobTypes))
	jobType: string

	@IsOptional()
	salary: number

	@IsOptional()
	@IsDateString()
	date: Date

	@IsOptional()
	@IsIn([1, 2, 3, 4, 5])
	sets: number

	@IsOptional()
	@IsBoolean()
	isActive: boolean
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