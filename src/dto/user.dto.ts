import { BasicDto } from './basic.dto'
import {
	IsDateString,
	IsEmail,
	IsIn, IsNumber,
	IsOptional,
	IsString, IsUrl,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator'
import { UserTypes } from '../app.interfaces'

export class AuthDto {
	@IsEmail()
	@MinLength(4)
	@MaxLength(50)
	email: string

	@IsString()
	@MinLength(8)
	@MaxLength(50)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/)
	password: string
}

export class UserDto extends BasicDto {
	@IsDateString()
	@IsOptional()
	dob?: Date

	@IsString()
	@IsOptional()
	name: string

	@IsEmail()
	@MinLength(4)
	@MaxLength(50)
	@IsOptional()
	email: string

	@IsIn(Object.values(UserTypes))
	@IsOptional()
	type?: UserTypes

	@IsOptional()
	@IsNumber()
	yearCommercialExp: number

	@IsUrl()
	@IsOptional()
	imageURL: string
}