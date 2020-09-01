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
import { User } from './entities/entity.user'

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
		const user = await this.authService.register(data)

		const id = await this.usersService.createProfile(user)

		return this.authService.login({ email: data.email, id })
	}

	@Get('oauth/facebook')
	@UseGuards(FacebookAuthGuard)
	oauthFacebook() {
		throw new UnauthorizedException()
	}


	@Get('oauth/callback')
	@UseGuards(FacebookAuthGuard)
	async oauthCallback(@Req() { user }) {
		let existsUser = await this.usersService.findByFbId(user.id)

		if (!existsUser) {
			const id = await this.usersService.createProfile(new User({
				facebookId: user.id,
				name      : user.name,
			}))

			existsUser = new User({ id, name: user.name })
		}

		return this.authService.login({ email: existsUser.name, id: existsUser.id })
	}
}