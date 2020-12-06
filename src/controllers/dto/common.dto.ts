import { IsNumber, IsOptional, IsString } from 'class-validator'

export class DbQueryDto {
	@IsOptional()
	@IsString()
	orderBy?: string

	@IsOptional()
	@IsNumber()
	limit?: number

	@IsOptional()
	@IsNumber()
	offset?: number

	@IsOptional()
	@IsString({ each: true })
	props?: string[]

	@IsOptional()
	@IsString({ each: true })
	relations?: string[]
}

export class RangeDto {
	@IsOptional()
	from?: Date

	@IsOptional()
	to?: Date
}