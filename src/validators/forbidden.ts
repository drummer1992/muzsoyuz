import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsForbidden(validationOptions?: ValidationOptions) {
	return function(object: Record<string, any>, propertyName: string) {
		registerDecorator({
			propertyName,
			name       : 'isForbidden',
			target     : object.constructor,
			options    : validationOptions,
			validator  : {
				validate(value: any) {
					return !value
				},

				defaultMessage(validationArguments?: ValidationArguments): string {
					return `${validationArguments.property} is forbidden`
				},
			},
		})
	}
}