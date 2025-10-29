import { DataSource } from 'typeorm';
import { Specie } from 'src/database/entities/specie.entity';

export async function seedSpecies(dataSource: DataSource) {
  const specieRepository = dataSource.getRepository(Specie);

  const speciesData = [
    { name: 'Cachorro', icon: '🐕' },
    { name: 'Gato', icon: '🐈' },
    { name: 'Pássaro', icon: '🐦' },
    { name: 'Peixe', icon: '🐠' },
    { name: 'Coelho', icon: '🐰' },
    { name: 'Hamster', icon: '🐹' },
    { name: 'Réptil', icon: '🦎' },
  ];

  console.log('🌱 Seeding species...');

  for (const specieData of speciesData) {
    const existingSpecie = await specieRepository.findOne({
      where: { name: specieData.name },
    });

    if (!existingSpecie) {
      const specie = specieRepository.create(specieData);
      await specieRepository.save(specie);
      console.log(`  ✅ Created specie: ${specie.name}`);
    } else {
      console.log(
        `  ⚠️  Specie "${specieData.name}" already exists, skipping...`,
      );
    }
  }

  console.log('✅ Species seeding completed!\n');
}
