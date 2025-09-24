import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuarios' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'smallint' })
  tipo_usuario_id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sobrenome?: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  telefone?: string;

  @Column({ type: 'text' })
  senha_hash: string;

  @Column({ type: 'text', nullable: true })
  foto_bi?: string;

  @Column({ type: 'boolean', default: false })
  aprovado: boolean;

  @Column({ type: 'bigint', nullable: true })
  plano_id?: number;

  @Column({ type: 'datetime', nullable: true })
  plano_expira_em?: Date | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
export type Usuario = {
  id: number;
  tipo_usuario_id: number;
  nome: string;
  sobrenome?: string;
  email?: string;
  telefone?: string;
  senha_hash: string;
  foto_bi?: string;
  aprovado: boolean;
  plano_id?: number;
  plano_expira_em?: string | null;
  created_at: string;
  updated_at: string;
};
