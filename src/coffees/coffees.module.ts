import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Injectable()
class DevelopmentConfigService{
	testing () {
		return "I am fucking development service";
	}
}
@Injectable()
export class CoffeesBrandsFactory {
	created () {
		return ['a', 'b', 'c']
	}
}
/**
 * if there is business requirements, we can use async factory functions ***
 */
@Module({
	imports: [
		TypeOrmModule.forFeature( [Coffee, Flavor, Event] ),
		// partial registration
		ConfigModule.forFeature(coffeesConfig)
	],
	controllers: [CoffeesController],
	providers: [
		// useValue injecting
		CoffeesService,
		CoffeesBrandsFactory,
		{
			provide: COFFEE_BRANDS,
			useFactory: (brandsFactory: CoffeesBrandsFactory) => 
				brandsFactory.created(),
			inject: [CoffeesBrandsFactory]
		},
		// {
		// 	provide: COFFEE_BRANDS,
		// 	useValue: ['premis', 'super', 'goldrose']
		// },
		// useClass injecting
		{
			provide: 'CONFIG_SERVICE',
			useClass: DevelopmentConfigService
		}
	],
	exports: [CoffeesService] // public access CoffeesService by other modules
})

export class CoffeesModule {}
