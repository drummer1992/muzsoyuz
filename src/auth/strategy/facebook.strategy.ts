import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-facebook'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			clientID     : process.env.FACEBOOK_CLIENT_ID,
			clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL  : process.env.REACT_FACEBOOK_CALLBACK_URL,
			profileFields: ['displayName', 'email', 'photos'],
		})
	}

	validate(accessToken, refreshToken, profile, done) {
		if (!accessToken || !profile) {
			return done(new UnauthorizedException())
		}

		return done(null, profile)
	}
}