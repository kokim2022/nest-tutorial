import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatebaseModule } from './datebase/datebase.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import appConfig from './config/app.config';
import { APP_PIPE } from '@nestjs/core';

/**
 * entities => relationship between typescript class and database tables
 */
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: ()=> ({
				type: 'postgres',
				host: process.env.DATABASE_HOST,	
				port: +process.env.DATABASE_PORT, // + is used to change string to number
				username: process.env.DATABASE_USER,
				password: process.env.DATABASE_PASSWORD,
				database: process.env.DATABASE_NAME,
				autoLoadEntities: true,
				synchronize: true,
			})
		}),
		ConfigModule.forRoot({
			load: [ appConfig ] // load out app config factor function file
			// /**
			//  * validation for .env datas
			//  */
			// validationSchema: Joi.object({
			// 	DATABASE_HOST: Joi.required(),
			// 	DATABASE_PORT: Joi.number().default(5432)
			// })
		}),
		CoffeesModule,
		CoffeeRatingModule,
		DatebaseModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
// {
// 	provide: APP_PIPE,
// 	useClass: ValidationPipe // global validation pipe 
// }