import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { OAuth2Strategy } from 'passport-google-oauth'
import { config } from '../../../config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy) {
	constructor() {
		super({
			clientID     : process.env.GOOGLE_CLIENT_ID,
			clientSecret : process.env.GOOGLE_CLIENT_SECRET,
			callbackURL  : config.getProviderCallback('google'),
			scope: ['email'],
		})
	}

	validate(accessToken, refreshToken, profile, done) {
		console.log({
			done,
			profile,
			accessToken,
			refreshToken,
		})

		if (!accessToken || !profile) {
			return done(new UnauthorizedException())
		}

		return done(null, profile)
	}
}