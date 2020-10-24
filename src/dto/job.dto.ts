import { IsDateString, IsIn, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { BasicDto } from './basic.dto'
import { JobTypes, Instruments } from '../app.interfaces'

export class JobFilterDto {
	@IsOptional()
	@IsIn(Object.values(Instruments))
	role: string

	@IsOptional()
	@IsString()
	city?: string

	@IsIn(Object.values(JobTypes))
	jobType: string

	@IsOptional()
	@IsString()
	props: string

	@IsOptional()
	id: string
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