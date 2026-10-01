import { Router } from 'express';
import type { ControladorContas } from '../controladores/controlador-contas';

export function criarRotasContas(controlador: ControladorContas) {
  const rotas = Router();

  rotas.post('/', controlador.abrir);
  rotas.get('/', controlador.listar);
  rotas.get('/:id', controlador.buscar);
  rotas.delete('/:id', controlador.encerrar);
  rotas.get('/:id/titular', controlador.consultarTitular);
  rotas.patch('/:id/titular', controlador.atualizarTitular);
  rotas.get('/:id/saldo', controlador.consultarSaldo);
  rotas.post('/:id/depositos', controlador.depositar);
  rotas.post('/:id/saques', controlador.sacar);

  return rotas;
}
