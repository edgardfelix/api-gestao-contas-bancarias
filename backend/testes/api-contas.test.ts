import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { criarAplicacao } from '../src/aplicacao';

const ROTA = '/api/v1/contas';
const titular = { nome: 'Maria Silva', cpf: '529.982.247-25', email: 'maria@email.com' };

async function abrirConta() {
  const api = request(criarAplicacao());
  const { body } = await api.post(ROTA).send(titular).expect(201);
  return { api, id: body.id as string };
}

describe(`API ${ROTA}`, () => {
  it('abre conta e normaliza o CPF', async () => {
    const { body } = await request(criarAplicacao()).post(ROTA).send(titular).expect(201);

    expect(body).toMatchObject({
      titular: { ...titular, cpf: '52998224725' },
      saldoEmCentavos: 0,
      status: 'ATIVA',
    });
  });

  it('retorna 400 apontando os campos inválidos', async () => {
    const { body } = await request(criarAplicacao())
      .post(ROTA)
      .send({ nome: 'Ma', cpf: '123.456.789-00', email: 'maria' })
      .expect(400);

    expect(body.erro.codigo).toBe('DADOS_INVALIDOS');
    expect(body.erro.detalhes.map((detalhe: { campo: string }) => detalhe.campo)).toEqual(['nome', 'cpf', 'email']);
  });

  it('retorna 400 quando o corpo não é um JSON válido', async () => {
    const { body } = await request(criarAplicacao())
      .post(ROTA)
      .set('Content-Type', 'application/json')
      .send('{ "nome": ')
      .expect(400);

    expect(body.erro.codigo).toBe('JSON_INVALIDO');
  });

  it('retorna 409 quando o CPF já tem conta ativa', async () => {
    const { api } = await abrirConta();

    const { body } = await api.post(ROTA).send(titular).expect(409);

    expect(body.erro.codigo).toBe('CPF_COM_CONTA_ATIVA');
  });

  it('retorna 404 para conta inexistente', async () => {
    const { body } = await request(criarAplicacao()).get(`${ROTA}/inexistente/saldo`).expect(404);

    expect(body.erro.codigo).toBe('CONTA_NAO_ENCONTRADA');
  });

  it('movimenta a conta e consulta o saldo', async () => {
    const { api, id } = await abrirConta();

    await api.post(`${ROTA}/${id}/depositos`).send({ valorEmCentavos: 15_000 }).expect(200);
    await api.post(`${ROTA}/${id}/saques`).send({ valorEmCentavos: 5_000 }).expect(200);
    const { body } = await api.get(`${ROTA}/${id}/saldo`).expect(200);

    expect(body).toEqual({ saldoEmCentavos: 10_000 });
  });

  it('retorna 422 ao sacar além do saldo', async () => {
    const { api, id } = await abrirConta();

    const { body } = await api.post(`${ROTA}/${id}/saques`).send({ valorEmCentavos: 1 }).expect(422);

    expect(body.erro.codigo).toBe('SALDO_INSUFICIENTE');
  });

  it('atualiza e consulta o titular', async () => {
    const { api, id } = await abrirConta();

    await api.patch(`${ROTA}/${id}/titular`).send({ email: 'maria.silva@email.com' }).expect(200);
    const { body } = await api.get(`${ROTA}/${id}/titular`).expect(200);

    expect(body).toEqual({ nome: 'Maria Silva', cpf: '52998224725', email: 'maria.silva@email.com' });
  });

  it('encerra a conta mantendo o registro', async () => {
    const { api, id } = await abrirConta();

    await api.delete(`${ROTA}/${id}`).expect(204);
    const { body } = await api.get(`${ROTA}/${id}`).expect(200);

    expect(body.status).toBe('ENCERRADA');
  });

  it('retorna 404 para rota inexistente', async () => {
    const { body } = await request(criarAplicacao()).get('/api/v1/inexistente').expect(404);

    expect(body.erro.codigo).toBe('ROTA_NAO_ENCONTRADA');
  });
});
