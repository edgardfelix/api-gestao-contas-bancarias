import type { ContaBancaria } from '../modelos/conta-bancaria';
import type { RepositorioContas } from './repositorio-contas';

// Guarda e devolve cópias, como um banco de verdade faria:
// alterar o objeto retornado não altera o registro salvo.
export class RepositorioContasEmMemoria implements RepositorioContas {
  private readonly contas = new Map<string, ContaBancaria>();

  async salvar(conta: ContaBancaria) {
    this.contas.set(conta.id, structuredClone(conta));
  }

  async buscarPorId(id: string) {
    const conta = this.contas.get(id);
    return conta && structuredClone(conta);
  }

  async buscarAtivaPorCpf(cpf: string) {
    const ativa = [...this.contas.values()].find((conta) => conta.titular.cpf === cpf && conta.status === 'ATIVA');
    return ativa && structuredClone(ativa);
  }

  async listar() {
    return [...this.contas.values()].map((conta) => structuredClone(conta));
  }
}
