import { type } from "os";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";
@Entity() // sql table = coffee
export class Coffee {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	brand: string;

	@Column({ default: 0 })
	recommendations: number;
	
	@JoinTable()
	@ManyToMany(
		type => Flavor, // relation entities
		(flavor) => flavor.coffees,
		{
			cascade: true // insert together with their relations
		}
	)
	flavors: Flavor [];
}