import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// setup validation
	app.useGlobalPipes(
		// whitelist is used only properties within the dtos
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true, // show which paras is not within the whitelist
			transform: true ,// transform payloads to dto instances
			// auto transform params type in pagination dto
			transformOptions: {
				enableImplicitConversion: true
			}
		})
	);
	await app.listen(3000);
}
bootstrap();
