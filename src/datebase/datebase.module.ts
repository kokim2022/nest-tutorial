import { DynamicModule, Module } from '@nestjs/common';
import { createConnection } from 'net';

@Module({
	
})
export class DatebaseModule {
	static register(options): DynamicModule {
		return {
			module: DatebaseModule,
			providers: [
				{
					provide: 'CONNECTION',
					useValue: createConnection(options),
				},
			],
		};
	}
}
