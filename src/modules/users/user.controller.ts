import {
	Body,
	Controller,
	Get,
	Inject,
	Patch, Post, Query, Req, UseGuards,
	UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common'
import { UserDto } from '../../dto/user.dto'
import { UserService } from './user.service'
import { LoggingInterceptor } from '../../logging/logging.interceptor'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { WorkdayDto, WorkdayFilterDto } from '../../dto/workday.dto'

@Controller('user')
@UseInterceptors(LoggingInterceptor)
export class UserController {
	@Inject()
	private readonly userService: UserService

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	getProfile(@Req() { user }, @Query('props') props) {
		return this.userService.getProfile(user.id, props)
	}

	@Patch('profile')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	updateProfile(@Req() { user }, @Body() data: UserDto) {
		return this.userService.updateProfile(user.id, data)
	}

	@Post('workday')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	markWorkingDay(@Req() { user }, @Body() data: WorkdayDto) {
		return this.userService.markWorkingDay(user, data)
	}

	@Post('findByBusyness')
	@UsePipes(ValidationPipe)
	findUsersByBusyness(@Body() filter: WorkdayFilterDto) {
		return this.userService.findUsersByBusyness(filter)
	}
}
