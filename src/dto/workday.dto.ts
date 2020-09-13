import { IsBoolean, IsDate, IsDateString, IsIn, IsOptional } from 'class-validator'
import { Instrument, UserType } from '../app.interfaces'

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
	@IsIn(Object.values(Instrument))
	musicalInstrument: Instrument

	@IsIn(Object.values(UserType))
	userType: UserType

	@IsBoolean()
	dayOff: boolean
}