import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Patch,
	Delete,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

// @UsePipes(ValidationPipe)

@Controller('coffees')
export class CoffeesController {
	// dependency setup 
	constructor(private readonly coffeeService: CoffeesService) {
	}

	// with pagination
	@Get()
	findAll(@Query() paginationQuery: PaginationQueryDto) {
		return this.coffeeService.findAll(paginationQuery);
	}

	// @UsePipes(ValidationPipe)
	@Get(':id')  
	findOne(@Param('id') id: number) {
		// console.log(typeof id)
		return this.coffeeService.findOne('' + id);
	}

	// post method
	@Post()
	create(@Body() createCoffeeDto: CreateCoffeeDto) {
		// instanceof => binary operator used to test if an object is of a given type.
		// console.log(createCoffeeDto instanceof CreateCoffeeDto)
		// 
		this.coffeeService.create(createCoffeeDto);
		return createCoffeeDto;
	}

	/**
	 * put => update entire object
	 * patch => update specifi property within object
	 */

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
		return this.coffeeService.update(id, updateCoffeeDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.coffeeService.remove(id);
	}
}
