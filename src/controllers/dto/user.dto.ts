import {
	IsDateString,
	IsEmail,
	IsIn, IsNumber,
	IsOptional,
	IsString, IsUrl,
	MaxLength,
	MinLength,
} from 'class-validator'
import { UserTypes } from '../../app.interfaces'
import { IsForbidden } from '../../validators/forbidden'

export class AuthDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(8)
	@MaxLength(50)
	password: string
}

export class UpdateUserDto {
	@IsDateString()
	@IsOptional()
	dob?: Date

	@IsString()
	@IsOptional()
	name: string

	@IsForbidden({ message: 'email is forbidden for update' })
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