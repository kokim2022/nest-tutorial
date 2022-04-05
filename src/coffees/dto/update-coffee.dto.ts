import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDto } from "./create-coffee.dto";

// PartialType => all of the properties are optional
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto){
}
