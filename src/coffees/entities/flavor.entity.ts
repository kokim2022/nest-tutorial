import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coffee } from "./coffee.entity";


@Entity() // entity is used to connect table using typeorm
export class Flavor {
	// primary key
	@PrimaryGeneratedColumn()
	id: number; 

	@Column()
	name: string;

	// coffees is the owner of the relationship, join table is not required
	@ManyToMany(
		type => Coffee,
		(coffee) => coffee.flavors
	)
	coffees: Coffee [];
}
