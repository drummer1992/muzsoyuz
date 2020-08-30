import { BasicDto } from './basic.dto'
import { Gender, UserType } from '../app.interfaces'
import {
	IsBoolean,
	IsDateString,
	IsEmail,
	IsIn,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator'

export class AuthDto {
	@IsEmail()
	@MinLength(4)
	@MaxLength(50)
	email: string

	@IsString()
	@MinLength(8)
	@MaxLength(50)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
	password: string
}

export class UserDto extends BasicDto {
	@IsDateString()
	@IsOptional()
	dob?: Date

	@IsString()
	@IsOptional()
	city?: string

	@IsOptional()
	@IsIn(Object.values(Gender))
	gender?: Gender

	@IsEmail()
	@MinLength(4)
	@MaxLength(50)
	email: string

	@IsIn(Object.values(UserType))
	@IsOptional()
	type?: UserType

	@IsBoolean()
	@IsOptional()
	online?: boolean
}