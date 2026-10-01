import { randomUUID } from 'node:crypto';
import { ErroConflito, ErroNaoEncontrado, ErroRegraNegocio } from '../erros/erros-aplicacao';
import type { ContaBancaria, Titular } from '../modelos/conta-bancaria';
import type { RepositorioContas } from '../repositorios/repositorio-contas';

export class ServicoContas {
  constructor(private readonly repositorio: RepositorioContas) {}

  async abrir(titular: Titular) {
    if (await this.repositorio.buscarAtivaPorCpf(titular.cpf)) {
      throw new ErroConflito('CPF_COM_CONTA_ATIVA', 'Já existe uma conta ativa para este CPF.');
    }

    const conta: ContaBancaria = {
      id: randomUUID(),
      titular,
      saldoEmCentavos: 0,
      status: 'ATIVA',
      criadaEm: new Date(),
    };

    await this.repositorio.salvar(conta);
    return conta;
  }

  listar() {
    return this.repositorio.listar();
  }

  async buscar(id: string) {
    const conta = await this.repositorio.buscarPorId(id);
    if (!conta) throw new ErroNaoEncontrado('CONTA_NAO_ENCONTRADA', 'Conta não encontrada.');
    return conta;
  }

  async atualizarTitular(id: string, dados: Partial<Pick<Titular, 'nome' | 'email'>>) {
    const conta = await this.buscarAtiva(id);
    conta.titular = { ...conta.titular, ...dados };
    await this.repositorio.salvar(conta);
    return conta.titular;
  }

  async depositar(id: string, valorEmCentavos: number) {
    const conta = await this.buscarAtiva(id);
    conta.saldoEmCentavos += valorEmCentavos;
    await this.repositorio.salvar(conta);
    return conta.saldoEmCentavos;
  }

  async sacar(id: string, valorEmCentavos: number) {
    const conta = await this.buscarAtiva(id);
    if (valorEmCentavos > conta.saldoEmCentavos) {
      throw new ErroRegraNegocio('SALDO_INSUFICIENTE', 'Saldo insuficiente para o saque.');
    }

    conta.saldoEmCentavos -= valorEmCentavos;
    await this.repositorio.salvar(conta);
    return conta.saldoEmCentavos;
  }

  async encerrar(id: string) {
    const conta = await this.buscarAtiva(id);
    if (conta.saldoEmCentavos > 0) {
      throw new ErroRegraNegocio('SALDO_NAO_ZERADO', 'A conta só pode ser encerrada com saldo zerado.');
    }

    conta.status = 'ENCERRADA';
    await this.repositorio.salvar(conta);
  }

  private async buscarAtiva(id: string) {
    const conta = await this.buscar(id);
    if (conta.status === 'ENCERRADA') {
      throw new ErroRegraNegocio('CONTA_ENCERRADA', 'Operação não permitida em conta encerrada.');
    }
    return conta;
  }
}
