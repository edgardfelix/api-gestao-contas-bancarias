import { criarAplicacao } from './aplicacao';

// PORT é injetada por plataformas como o Render; PORTA mantém compatibilidade local
const porta = Number(process.env.PORT ?? process.env.PORTA ?? 3333);

criarAplicacao().listen(porta, () => {
  console.log(`API rodando em http://localhost:${porta}/api/v1/contas`);
});
