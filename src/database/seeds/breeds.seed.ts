import { DataSource } from 'typeorm';
import { Breed } from 'src/database/entities/breed.entity';
import { Specie } from 'src/database/entities/specie.entity';

export async function seedBreeds(dataSource: DataSource) {
  const breedRepository = dataSource.getRepository(Breed);
  const specieRepository = dataSource.getRepository(Specie);

  // Buscar espécies
  const cachorro = await specieRepository.findOne({
    where: { name: 'Cachorro' },
  });
  const gato = await specieRepository.findOne({ where: { name: 'Gato' } });
  const passaro = await specieRepository.findOne({
    where: { name: 'Pássaro' },
  });
  const peixe = await specieRepository.findOne({ where: { name: 'Peixe' } });
  const coelho = await specieRepository.findOne({ where: { name: 'Coelho' } });

  if (!cachorro || !gato || !passaro || !peixe || !coelho) {
    console.log('⚠️  Some species not found. Please run species seed first.');
    return;
  }

  const breedsData = [
    // Raças de Cachorro
    { name: 'Labrador Retriever', specie: cachorro },
    { name: 'Golden Retriever', specie: cachorro },
    { name: 'Pastor Alemão', specie: cachorro },
    { name: 'Bulldog Francês', specie: cachorro },
    { name: 'Bulldog Inglês', specie: cachorro },
    { name: 'Beagle', specie: cachorro },
    { name: 'Poodle', specie: cachorro },
    { name: 'Rottweiler', specie: cachorro },
    { name: 'Yorkshire Terrier', specie: cachorro },
    { name: 'Dachshund (Salsicha)', specie: cachorro },
    { name: 'Boxer', specie: cachorro },
    { name: 'Husky Siberiano', specie: cachorro },
    { name: 'Pug', specie: cachorro },
    { name: 'Shih Tzu', specie: cachorro },
    { name: 'Chihuahua', specie: cachorro },
    { name: 'Border Collie', specie: cachorro },
    { name: 'Pitbull', specie: cachorro },
    { name: 'Spitz Alemão (Lulu da Pomerânia)', specie: cachorro },
    { name: 'Dobermann', specie: cachorro },
    { name: 'Vira-lata (SRD)', specie: cachorro },

    // Raças de Gato
    { name: 'Persa', specie: gato },
    { name: 'Maine Coon', specie: gato },
    { name: 'Siamês', specie: gato },
    { name: 'Ragdoll', specie: gato },
    { name: 'Bengal', specie: gato },
    { name: 'British Shorthair', specie: gato },
    { name: 'Sphynx', specie: gato },
    { name: 'Scottish Fold', specie: gato },
    { name: 'Abissínio', specie: gato },
    { name: 'Birmanês', specie: gato },
    { name: 'Angorá', specie: gato },
    { name: 'Exotic Shorthair', specie: gato },
    { name: 'Gato sem raça (SRD)', specie: gato },

    // Tipos de Pássaros
    { name: 'Calopsita', specie: passaro },
    { name: 'Periquito Australiano', specie: passaro },
    { name: 'Canário', specie: passaro },
    { name: 'Papagaio', specie: passaro },
    { name: 'Agapornis', specie: passaro },
    { name: 'Cacatua', specie: passaro },
    { name: 'Mandarim', specie: passaro },

    // Tipos de Peixe
    { name: 'Betta', specie: peixe },
    { name: 'Guppy', specie: peixe },
    { name: 'Peixe Dourado', specie: peixe },
    { name: 'Neon', specie: peixe },
    { name: 'Molly', specie: peixe },
    { name: 'Platy', specie: peixe },
    { name: 'Acará Bandeira', specie: peixe },
    { name: 'Tetra', specie: peixe },
    { name: 'Kinguio', specie: peixe },

    // Tipos de Coelho
    { name: 'Mini Coelho', specie: coelho },
    { name: 'Coelho Anão', specie: coelho },
    { name: 'Coelho Rex', specie: coelho },
    { name: 'Coelho Angorá', specie: coelho },
    { name: 'Coelho Fuzzy Lop', specie: coelho },
    { name: 'Coelho Lion Head', specie: coelho },
  ];

  console.log('🌱 Seeding breeds...');

  for (const breedData of breedsData) {
    const existingBreed = await breedRepository.findOne({
      where: { name: breedData.name },
    });

    if (!existingBreed) {
      const breed = breedRepository.create(breedData);
      await breedRepository.save(breed);
      console.log(
        `  ✅ Created breed: ${breed.name} (${breedData.specie.name})`,
      );
    } else {
      console.log(
        `  ⚠️  Breed "${breedData.name}" already exists, skipping...`,
      );
    }
  }

  console.log('✅ Breeds seeding completed!\n');
}
