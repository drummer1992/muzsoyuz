import { IsDateString, IsIn, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { BasicDto } from './basic.dto'
import { FeedType, Instrument } from '../app.interfaces'

export class FeedFilterDto {
	@IsOptional()
	@IsIn(Object.values(Instrument))
	musicalInstrument: string

	@IsOptional()
	@IsString()
	city?: string

	@IsIn(Object.values(FeedType))
	feedType: string

	@IsOptional()
	@IsString()
	props: string
}

export class BasicFeedDto extends BasicDto {
	@IsString()
	@IsOptional()
	extraInfo?: string

	@IsString()
	@MinLength(10)
	@MaxLength(250)
	title: string

	@IsIn(Object.values(FeedType))
	feedType: string
}

export class MusicalReplacementDto extends BasicFeedDto {
	@IsString()
	@IsOptional()
	address: string

	@IsOptional()
	location: any

	@IsNumber()
	amount: number

	@IsDateString()
	date: Date

	@IsNumber()
	@IsIn([1, 2, 3, 4, 5])
	musicalSets: number
}

export class SelfPromotionDto extends BasicFeedDto {

}

export class JobDto extends BasicFeedDto {

}

export type FeedDto = JobDto | SelfPromotionDto | MusicalReplacementDto