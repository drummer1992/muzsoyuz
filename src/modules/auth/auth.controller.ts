import {
	Body,
	Get,
	Inject,
	Post, Req,
	UnauthorizedException,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
	Controller,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserService } from '../users/user.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthDto } from '../../dto/user.dto'
import { FacebookAuthGuard } from './guards/facebook-auth.guard'
import { GoogleAuthGuard } from './guards/google-auth.guard'
import { LoggingInterceptor } from '../../logging/logging.interceptor'

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
	@Inject()
	private readonly authService: AuthService
	@Inject()
	private readonly userService: UserService

	@Post('login')
	@UsePipes(ValidationPipe)
	@UseGuards(LocalAuthGuard)
	async login(@Req() { user }) {
		return {
			token  : this.authService.login({ username: user.email, sub: user.id }),
			profile: await this.userService.getProfile(user.id),
		}
	}

	@Post('register')
	@UsePipes(ValidationPipe)
	register(@Body() data: AuthDto): Promise<{ token: string }> {
		return this.authService.register(data)
	}

	@Get('oauth/facebook')
	@UseGuards(FacebookAuthGuard)
	oauthFacebook() {
		throw new UnauthorizedException()
	}

	@Get('oauth/google')
	@UseGuards(GoogleAuthGuard)
	oauthGoogle() {
		throw new UnauthorizedException()
	}

	@Get('oauth/google/callback')
	@UseGuards(GoogleAuthGuard)
	oauthGoogleCallback(@Req() { user }) {
		return this.authService.oauthHandler(user)
	}

	@Get('oauth/facebook/callback')
	@UseGuards(FacebookAuthGuard)
	oauthFacebookCallback(@Req() { user }) {
		return this.authService.oauthHandler(user)
	}
}