export class CreatePlanoDto {
  nome!: string;
  descricao?: string;
  preco!: number;
  duracao_dias!: number;
  ativo!: boolean;
}
