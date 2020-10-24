import { IsBoolean, IsDate, IsDateString, IsIn, IsOptional } from 'class-validator'
import { Instruments, UserTypes } from '../app.interfaces'

export class WorkdayDto {
	@IsDate()
	@IsOptional()
	date: Date

	@IsBoolean()
	dayOff: boolean
}

export class WorkdayFilterDto {
	@IsOptional()
	@IsDateString()
	from: Date

	@IsOptional()
	@IsDateString()
	to: Date

	@IsOptional()
	@IsIn(Object.values(Instruments))
	role: Instruments

	@IsIn(Object.values(UserTypes))
	userType: UserTypes

	@IsBoolean()
	dayOff: boolean
}