/* eslint-disable */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-facebook'
import { config } from '../../../config'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			clientID     : process.env.FACEBOOK_CLIENT_ID,
			clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL  : config.getProviderCallback('facebook'),
			profileFields: ['displayName', 'email', 'picture.type(large)'],
		})
	}

	validate(accessToken, refreshToken, profile, done, info) {
		if (!accessToken || !profile) {
			return done(new UnauthorizedException())
		}

		return done(null, profile)
	}
}