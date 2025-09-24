import { Module, Global } from '@nestjs/common';
import { createPool } from 'mysql2/promise';

export const DATABASE_POOL = 'DATABASE_POOL';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: () => {
        const pool = createPool({
          host: process.env.DB_HOST ?? 'localhost',
          port: Number(process.env.DB_PORT ?? 3306),
          user: process.env.DB_USER ?? 'root',
          password: process.env.DB_PASS ?? '',
          database: process.env.DB_NAME ?? 'multservice',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        });
        return pool;
      },
    },
  ],
  exports: [DATABASE_POOL],
})
export class DatabaseModule {}
