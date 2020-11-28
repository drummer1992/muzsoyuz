import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator'
import { Instruments } from '../app.interfaces'
import { IStats } from '../entities/entity.basic'

export abstract class StatsDto implements IStats {
	@IsOptional()
	@IsNumber()
	yearCommercialExp: number

	@IsOptional()
	@IsNumber()
	countOfJobs: number

	@IsOptional()
	@IsNumber()
	countOfLikes: number

	@IsOptional()
	@IsNumber()
	countOfDisLikes: number
}

export abstract class BasicDto extends StatsDto {
	@IsString()
	@IsOptional()
	phone: string

	@IsString()
	@IsOptional()
	altPhone: string

	@IsIn(Object.values(Instruments))
	@IsOptional()
	role: Instruments
}

export abstract class DbQueryDto {
	@IsOptional()
	@IsString()
	orderBy: string

	@IsOptional()
	@IsNumber()
	limit: null

	@IsOptional()
	@IsNumber()
	offset: null

	@IsOptional()
	@IsString({ each: true })
	props: string

	@IsOptional()
	@IsString({ each: true })
	relations: string
}