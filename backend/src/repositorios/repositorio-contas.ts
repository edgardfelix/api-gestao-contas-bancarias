import type { ContaBancaria } from '../modelos/conta-bancaria';

export interface RepositorioContas {
  salvar(conta: ContaBancaria): Promise<void>;
  buscarPorId(id: string): Promise<ContaBancaria | undefined>;
  buscarAtivaPorCpf(cpf: string): Promise<ContaBancaria | undefined>;
  listar(): Promise<ContaBancaria[]>;
}
