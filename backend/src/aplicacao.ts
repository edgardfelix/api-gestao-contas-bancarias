import express from 'express';
import { ControladorContas } from './controladores/controlador-contas';
import { ErroNaoEncontrado } from './erros/erros-aplicacao';
import { tratadorErros } from './middlewares/tratador-erros';
import type { RepositorioContas } from './repositorios/repositorio-contas';
import { RepositorioContasEmMemoria } from './repositorios/repositorio-contas-em-memoria';
import { criarRotasContas } from './rotas/rotas-contas';
import { ServicoContas } from './servicos/servico-contas';

export function criarAplicacao(repositorio: RepositorioContas = new RepositorioContasEmMemoria()) {
  const controlador = new ControladorContas(new ServicoContas(repositorio));
  const aplicacao = express();

  aplicacao.disable('x-powered-by');
  aplicacao.use(express.json());
  aplicacao.use('/api/v1/contas', criarRotasContas(controlador));
  aplicacao.use(() => {
    throw new ErroNaoEncontrado('ROTA_NAO_ENCONTRADA', 'Rota não encontrada.');
  });
  aplicacao.use(tratadorErros);

  return aplicacao;
}
