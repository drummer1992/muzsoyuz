import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator'
import { Instrument } from '../app.interfaces'
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
	firstName: string

	@IsString()
	@IsOptional()
	lastName?: string

	@IsNumber()
	@IsOptional()
	phone: number

	@IsNumber()
	@IsOptional()
	altPhone: number

	@IsIn(Object.values(Instrument))
	musicalInstrument: Instrument
}