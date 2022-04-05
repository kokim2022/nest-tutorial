import { Module } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { DatebaseModule } from 'src/datebase/datebase.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
	providers: [CoffeeRatingService],
	// import other module
	imports: [
		// dynamic module import
		DatebaseModule.register({
			type: 'postgres',
			host: 'localhost',
			password: 'password',
			port: 5432
		}),
		CoffeesModule
	]
})
export class CoffeeRatingModule { }
