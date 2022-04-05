import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
// @Index is used for performance
@Index(['name', 'type'])
@Entity()
export class Event {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	type: string;

	@Index()
	@Column()
	name: string;

	// generic columns where we can store event payloads
	@Column('json')
	payload: Record<string, any>;
}
