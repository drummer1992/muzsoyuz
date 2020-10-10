import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../users/user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategy/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.strategy'
import { FacebookStrategy } from './strategy/facebook.strategy'
import { GoogleStrategy } from './strategy/google.strategy'
import { AuthController } from './auth.controller'

@Module({
	imports    : [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret     : process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
		}),
	],
	providers  : [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		FacebookStrategy,
		GoogleStrategy,
	],
	controllers: [AuthController],
})
export class AuthModule {
}
