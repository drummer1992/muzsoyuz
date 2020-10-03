export class StringUtils {
	static isString(str, predicate?: (params: any) => boolean) {
		return typeof str === 'string' && (!predicate || predicate(str))
	}
}