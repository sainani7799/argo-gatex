import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import configuration from '../../config/configuration';

const databaseConfig = configuration().database;

export const typeOrmConfig: DataSourceOptions = {
  type: databaseConfig.type,
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.dbName,
  timezone: 'Z',
  migrations: ['dist/database/migrations/*.js*{.ts,.js}'],
  extra: {
    connectionLimit: databaseConfig.poolLimit,
    charset: databaseConfig.charset
  }
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    return {
      ...typeOrmConfig,
      synchronize: false,
      logging: true,
      //namingStrategy: new SnakeNamingStrategy(),
      //logger: new QueryLogger(new PinoLogger({ pinoHttp: { level: configService.get().logLevel } })),
      autoLoadEntities: true
    }
  },
};

