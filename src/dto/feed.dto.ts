import {
	IsDateString,
	IsIn,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'
import { BasicDto } from './basic.dto'
import { FeedType } from '../app.interfaces'

export class BasicFeedDto extends BasicDto {
	@IsString()
	@IsOptional()
	extraInfo?: string

	@IsString()
	@MinLength(10)
	@MaxLength(250)
	title: string

	@IsIn(Object.values(FeedType))
	type: string
}

export class JobFeedDto extends BasicFeedDto {
	@IsString()
	@IsOptional()
	address: string

	@IsNumber()
	amount: number

	@IsDateString()
	date: Date

	@IsNumber()
	@IsIn([1, 2, 3, 4, 5])
	musicalSets: number
}

export class UserFeedDto extends BasicFeedDto {

}