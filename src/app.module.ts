import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BooksModule } from './books/books.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { ControlerController } from './controler/controler.controller.js';
import { ServiceService } from './service/service.service.js';

@Module({
  imports: [
    BooksModule,
    AuthModule, ConfigModule.forRoot({
      isGlobal:true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV:Joi.string()
          .valid('development','staging','production')
          .default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required()

      })
    }),
    
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get<string>('DB_HOST'),
        port: ConfigService.get<number>('DB_PORT'),
        username: ConfigService.get<string>('DB_USERNAME'),
        password: ConfigService.get<string>('DB_PASSWORD'),
        database: ConfigService.get<string>('DB_DATABASE'),

        autoLoadEntities:true,

        synchronize: ConfigService.get<string>('NODE_ENV') === 'development'
      })
    }),
    
    CategoriesModule,
    CustomersModule
  
  ],
  controllers: [AppController, ControlerController],
  providers: [AppService, ServiceService],
})
export class AppModule {}
