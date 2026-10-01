export type StatusConta = 'ATIVA' | 'ENCERRADA';

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
  criadaEm: Date;
}
