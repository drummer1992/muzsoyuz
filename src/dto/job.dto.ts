import { IsDateString, IsIn, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { BasicDto, PaginationDto } from './basic.dto'
import { JobTypes, Instruments } from '../app.interfaces'
import { IsArrayOf } from '../validators/array-of-string'

export class JobFilterDto extends PaginationDto {
	@IsOptional()
	id: string

	@IsOptional()
	@IsArrayOf(Object.values(Instruments))
	role: string

	@IsOptional()
	@IsString()
	city?: string

	@IsArrayOf(Object.values(JobTypes))
	jobType: string
}

export class BasicJobDto extends BasicDto {
	@IsString()
	@IsOptional()
	extraInfo?: string

	@IsString()
	@MinLength(10)
	@MaxLength(250)
	title: string

	@IsIn(Object.values(JobTypes))
	jobType: string
}

export class MusicalReplacementDto extends BasicJobDto {
	@IsString()
	@IsOptional()
	address: string

	@IsOptional()
	location: any

	@IsNumber()
	salary: number

	@IsDateString()
	date: Date

	@IsNumber()
	@IsIn([1, 2, 3, 4, 5])
	sets: number
}

export class SelfPromotionDto extends BasicJobDto {
	@IsDateString()
	date: Date
}

export type JobDto = SelfPromotionDto | MusicalReplacementDto