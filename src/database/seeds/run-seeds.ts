import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { seedAdmin } from './admin.seed';
import { seedSpecies } from './species.seed';
import { seedBreeds } from './breeds.seed';
import { seedFileCategories } from './file-categories.seed';

// Carregar variáveis de ambiente
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: Number(configService.get('DB_PORT', 3306)),
  username: configService.get('DB_USER', 'root'),
  password: configService.get('DB_PASS', ''),
  database: configService.get('DB_NAME', 'trackmypet'),
  entities: ['src/database/entities/**/*.{ts,entity.ts}'],
  synchronize: false,
});

async function runSeeds() {
  try {
    console.log('🌱 Starting database seeding...\n');

    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    await seedAdmin(AppDataSource);
    await seedSpecies(AppDataSource);
    await seedBreeds(AppDataSource);
    await seedFileCategories(AppDataSource);

    console.log('\n🎉 Seeding completed successfully!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

void runSeeds();
