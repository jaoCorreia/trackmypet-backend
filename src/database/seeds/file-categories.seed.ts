import { DataSource } from 'typeorm';
import { FileCategory } from '../entities/file-category.entity';

export async function seedFileCategories(
  dataSource: DataSource,
): Promise<void> {
  console.log('🗂️  Seeding file categories...');

  const fileCategoryRepository = dataSource.getRepository(FileCategory);

  const defaultCategories = [
    { name: 'Documentos' },
    { name: 'Exames' },
    { name: 'Vacinas' },
  ];

  for (const categoryData of defaultCategories) {
    const existing = await fileCategoryRepository.findOne({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { name: categoryData.name, user: null as any },
    });

    if (!existing) {
      const category = fileCategoryRepository.create({
        name: categoryData.name,
        user: undefined,
      });
      await fileCategoryRepository.save(category);
      console.log(`   ✅ Category "${categoryData.name}" created`);
    } else {
      console.log(`   ⏭️  Category "${categoryData.name}" already exists`);
    }
  }

  console.log('✅ File categories seeded successfully!\n');
}
