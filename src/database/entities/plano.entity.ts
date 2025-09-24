import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'planos' })
export class PlanoEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'decimal', precision: 10, scale: 0 })
  preco: number;

  @Column({ type: 'integer', width: 11 })
  duracao_dias: number;

  @Column({ type: 'boolean' })
  ativo: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

export type Plano = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao_dias: number;
  ativo: boolean;
  created_at: string;
};
