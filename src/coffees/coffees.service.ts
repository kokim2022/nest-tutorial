import { HttpCode, HttpException, HttpStatus, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import coffeesConfig from './config/coffees.config';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

/**
 * author recomment default singleton scope
 */
@Injectable()
export class CoffeesService {
	constructor(
		@InjectRepository(Coffee)
		private readonly coffeeRepositary: Repository<Coffee>,

		@InjectRepository(Flavor)
		private readonly flavorRepository: Repository<Flavor>,

		private readonly connection: Connection,
		// inject custom use value provider (uses injection token)
		@Inject(COFFEE_BRANDS) coffeeBrands: string[],
		// inject custom use class provider(uses string token)
		@Inject('CONFIG_SERVICE') private developmentConfigService,
		// inject type token 
		@Inject(coffeesConfig.KEY)
		private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>
	) {
		// console.log(developmentConfigService.testing())
		// console.log('coffeeBrands ' + coffeeBrands)
		console.log(coffeesConfiguration)
	}

	/**
	 * transactions similar to events of laravel
	 * @param coffee 
	 */
	async recommendCoffee(coffee: Coffee) {
		const queryRunner = this.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			coffee.recommendations++;

			const recommendEvent = new Event();
			recommendEvent.name = 'recommend_coffee';
			recommendEvent.type = 'coffee';
			recommendEvent.payload = { coffeeId: coffee.id };

			await queryRunner.manager.save(coffee);
			await queryRunner.manager.save(recommendEvent);

			await queryRunner.commitTransaction();
		} catch (err) {
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}

	findAll(paginationQuery: PaginationQueryDto) {
		const { limit, offset } = paginationQuery;
		return this.coffeeRepositary.find({
			// relation flavors
			relations: ['flavors'],
			skip: offset,
			take: limit
		})
	}

	async findOne(id: string) {
		// throw ('random error')
		const coffee = await this.coffeeRepositary.findOne(id, {
			relations: ['flavors']
		});
		if (!coffee) {
			throw new NotFoundException(`Coffee ${id} not found`)
			// throw new HttpException(`Coffee ${id} not founde`, HttpStatus.NOT_FOUND)
		}
		return coffee;
	}

	async create(createCoffeeDto: CreateCoffeeDto) {
		const flavors = await Promise.all(
			createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
		)

		// create coffee instance
		const coffee = this.coffeeRepositary.create({
			...createCoffeeDto,  //overide flavor with new calculated flavors
			flavors: flavors
		})
		// save new entity into the database
		return this.coffeeRepositary.save(coffee)
	}

	async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
		// inline condition
		const flavors = updateCoffeeDto.flavors && (await Promise.all(
			updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
		))
		// find the related entity, and updates new data
		const coffee = await this.coffeeRepositary.preload({
			id: +id,
			...updateCoffeeDto,
			flavors: flavors
		});
		// for not found
		if (!coffee) {
			throw new NotFoundException(`Coffee #${id} not found`)
		}
		// save updated data into the database
		return this.coffeeRepositary.save(coffee);
	}

	async remove(id: string) {
		const coffee = await this.coffeeRepositary.findOne(id);
		return this.coffeeRepositary.remove(coffee)
	}

	private async preloadFlavorByName(name: string): Promise<Flavor> {
		const exitingFlavor = await this.flavorRepository.findOne({ name });
		if (exitingFlavor) {
			return exitingFlavor
		}
		return this.flavorRepository.create({ name })
	}
}