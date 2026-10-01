import type { ContaBancaria, Titular } from '../tipos/conta-bancaria';

interface Saldo {
  saldoEmCentavos: number;
}

interface RespostaErro {
  erro?: { mensagem: string; detalhes?: { mensagem: string }[] };
}

async function requisitar<T>(caminho: string, metodo = 'GET', corpo?: unknown): Promise<T> {
  const resposta = await fetch(`/api/v1/contas${caminho}`, {
    method: metodo,
    headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  if (resposta.ok) {
    return resposta.status === 204 ? (undefined as T) : resposta.json();
  }

  const { erro }: RespostaErro = await resposta.json().catch(() => ({}));
  const detalhes = erro?.detalhes?.map((detalhe) => detalhe.mensagem).join(' · ');
  throw new Error(detalhes || erro?.mensagem || 'Não foi possível conectar à API.');
}

export const apiContas = {
  listar: () => requisitar<ContaBancaria[]>(''),
  abrir: (titular: Titular) => requisitar<ContaBancaria>('', 'POST', titular),
  consultarTitular: (id: string) => requisitar<Titular>(`/${id}/titular`),
  atualizarTitular: (id: string, dados: Pick<Titular, 'nome' | 'email'>) =>
    requisitar<Titular>(`/${id}/titular`, 'PATCH', dados),
  consultarSaldo: (id: string) => requisitar<Saldo>(`/${id}/saldo`),
  depositar: (id: string, valorEmCentavos: number) =>
    requisitar<Saldo>(`/${id}/depositos`, 'POST', { valorEmCentavos }),
  sacar: (id: string, valorEmCentavos: number) => requisitar<Saldo>(`/${id}/saques`, 'POST', { valorEmCentavos }),
  encerrar: (id: string) => requisitar<void>(`/${id}`, 'DELETE'),
};
