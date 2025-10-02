import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.entity';
import { UserRole } from 'src/database/entities/user-role.enum';

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@trackmypet.com';

  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('⚠️  Admin already exists, skipping...');
    return;
  }

  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'ChangeMe123!',
    10,
  );

  const admin = userRepository.create({
    email: adminEmail,
    passwordHash,
    name: process.env.ADMIN_NAME || 'System Administrator',
    cpf: process.env.ADMIN_CPF || '00000000000',
    birthDate: new Date(process.env.ADMIN_BIRTH_DATE || '1990-01-01'),
    phoneNumber: process.env.ADMIN_PHONE || '00000000000',
    role: UserRole.ADMIN,
  });

  await userRepository.save(admin);

  console.log('\n✅ Admin user created successfully!');
  console.log(`📧 Email: ${admin.email}`);
  console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'ChangeMe123!'}`);
  console.log(`⚠️  CHANGE THE PASSWORD IMMEDIATELY AFTER FIRST LOGIN!\n`);
}
