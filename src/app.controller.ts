import { LoggingInterceptor } from './logging/logging.interceptor'
import { Controller, Get, UseInterceptors } from '@nestjs/common'

const fs = require('fs')
const path = require('path')

@Controller('/')
@UseInterceptors(LoggingInterceptor)
export class AppController {
	@Get('.well-known/acme-challenge/Mc8qV49PucgEoD_edmAI6LgrIRCWguThIU9ub1KfisY')
	getSSL() {
		return fs.readFileSync(path.resolve(__dirname, '../cert')).toString()
	}
}
