import { IsBoolean, IsDateString, IsIn, IsOptional } from 'class-validator'
import { Instruments, UserTypes } from '../../app.interfaces'

export class WorkdayDto {
	@IsDateString({ each: true })
	dates: Date[]

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