import {
	Controller,
	Request,
	Post,
	UseGuards,
	UseInterceptors,
	Inject,
	UsePipes,
	ValidationPipe,
	Body, Get, Req, UnauthorizedException,
} from '@nestjs/common'
import { LoggingInterceptor } from './logging/logging.interceptor'
import { LocalAuthGuard } from './auth/guards/local-auth.guard'
import { AuthService } from './auth/auth.service'
import { UsersService } from './users/users.service'
import { AuthDto } from './dto/user.dto'
import { FacebookAuthGuard } from './auth/guards/facebook-auth.guard'
import { GoogleAuthGuard } from './auth/guards/google-auth.guard'

@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
	@Inject()
	private readonly authService: AuthService
	@Inject()
	private readonly usersService: UsersService

	@UseGuards(LocalAuthGuard)
	@Post('auth/login')
	login(@Request() req) {
		return this.authService.login(req.user)
	}

	@Post('auth/register')
	@UsePipes(ValidationPipe)
	async register(@Body() data: AuthDto): Promise<object> {
		return this.authService.login({
			username: data.email,
			sub: await this.usersService.createProfile(await this.authService.register(data)) })
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
	async oauthFacebookCallback(@Req() { user }) {
		return this.authService.oauthHandler(user)
	}
}