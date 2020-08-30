export abstract class ObjectUtils {
	static pick(object, props) {
		return props.reduce(
			(obj, attr) => Object.assign(obj, { [attr]: object[attr] }), {},
		)
	}

	static omit(object, props) {
		return Object.keys(object).reduce(
			(result, key) => Object.assign(result, props.includes(key)
				? {}
				: { [key]: object[key] }),
			{},
		)
	}
}