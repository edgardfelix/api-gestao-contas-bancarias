import { beforeEach, describe, expect, it } from 'vitest';
import { RepositorioContasEmMemoria } from '../src/repositorios/repositorio-contas-em-memoria';
import { ServicoContas } from '../src/servicos/servico-contas';

const titular = { nome: 'Maria Silva', cpf: '52998224725', email: 'maria@email.com' };

describe('ServicoContas', () => {
  let servico: ServicoContas;

  beforeEach(() => {
    servico = new ServicoContas(new RepositorioContasEmMemoria());
  });

  it('abre conta ativa com saldo zerado', async () => {
    const conta = await servico.abrir(titular);

    expect(conta).toMatchObject({ titular, saldoEmCentavos: 0, status: 'ATIVA' });
    expect(await servico.buscar(conta.id)).toEqual(conta);
  });

  it('não permite duas contas ativas para o mesmo CPF', async () => {
    await servico.abrir(titular);

    await expect(servico.abrir(titular)).rejects.toMatchObject({ codigo: 'CPF_COM_CONTA_ATIVA' });
  });

  it('permite abrir nova conta depois que a anterior foi encerrada', async () => {
    const { id } = await servico.abrir(titular);
    await servico.encerrar(id);

    await expect(servico.abrir(titular)).resolves.toMatchObject({ status: 'ATIVA' });
  });

  it('deposita e saca atualizando o saldo', async () => {
    const { id } = await servico.abrir(titular);

    expect(await servico.depositar(id, 10_000)).toBe(10_000);
    expect(await servico.sacar(id, 2_550)).toBe(7_450);
  });

  it('não permite sacar mais do que o saldo', async () => {
    const { id } = await servico.abrir(titular);
    await servico.depositar(id, 1_000);

    await expect(servico.sacar(id, 1_001)).rejects.toMatchObject({ codigo: 'SALDO_INSUFICIENTE' });
    expect((await servico.buscar(id)).saldoEmCentavos).toBe(1_000);
  });

  it('só encerra a conta com saldo zerado', async () => {
    const { id } = await servico.abrir(titular);
    await servico.depositar(id, 500);

    await expect(servico.encerrar(id)).rejects.toMatchObject({ codigo: 'SALDO_NAO_ZERADO' });

    await servico.sacar(id, 500);
    await servico.encerrar(id);
    expect((await servico.buscar(id)).status).toBe('ENCERRADA');
  });

  it('bloqueia operações em conta encerrada', async () => {
    const { id } = await servico.abrir(titular);
    await servico.encerrar(id);

    await expect(servico.depositar(id, 100)).rejects.toMatchObject({ codigo: 'CONTA_ENCERRADA' });
    await expect(servico.atualizarTitular(id, { nome: 'Maria S.' })).rejects.toMatchObject({ codigo: 'CONTA_ENCERRADA' });
  });

  it('atualiza o titular sem alterar o CPF', async () => {
    const { id } = await servico.abrir(titular);

    const atualizado = await servico.atualizarTitular(id, { email: 'maria.silva@email.com' });

    expect(atualizado).toEqual({ ...titular, email: 'maria.silva@email.com' });
  });

  it('informa quando a conta não existe', async () => {
    await expect(servico.buscar('inexistente')).rejects.toMatchObject({ codigo: 'CONTA_NAO_ENCONTRADA' });
  });
});
