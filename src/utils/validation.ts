import { businessAssert } from '../lib/errors'

export abstract class ValidationUtils {
	static validateDTO(data, validAttributes) {
		const invalidAttributes = Object.keys(data).filter(field => !validAttributes.includes(field))

		businessAssert(
			!invalidAttributes.length,
			`These attributes not valid: [${invalidAttributes.join(', ')}]`
		)
	}
}