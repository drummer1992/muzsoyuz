import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from './config'

async function bootstrap(port) {
  return await NestFactory.create(AppModule).then(app => app.listen(port))
}

bootstrap(config.getPort())
  .catch(e => {
    console.error(e)
    process.exit(-1)
  })
