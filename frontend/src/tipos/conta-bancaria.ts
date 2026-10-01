export type StatusConta = 'ATIVA' | 'ENCERRADA';

export type TipoMovimentacao = 'deposito' | 'saque';

export interface Titular {
  nome: string;
  cpf: string;
  email: string;
}

export interface ContaBancaria {
  id: string;
  titular: Titular;
  saldoEmCentavos: number;
  status: StatusConta;
  criadaEm: string;
}
