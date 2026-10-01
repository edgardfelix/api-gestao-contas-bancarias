import { criarAplicacao } from './aplicacao';

const porta = Number(process.env.PORTA ?? 3333);

criarAplicacao().listen(porta, () => {
  console.log(`API rodando em http://localhost:${porta}/api/v1/contas`);
});
