import { IsNumber, IsOptional, IsString } from 'class-validator'

export class DbQueryDto {
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
	props: string[]

	@IsOptional()
	@IsString({ each: true })
	relations: string[]
}