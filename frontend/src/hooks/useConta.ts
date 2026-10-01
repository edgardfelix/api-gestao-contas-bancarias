import { useEffect, useState } from 'react';
import { apiContas } from '../servicos/api-contas';
import type { TipoMovimentacao, Titular } from '../tipos/conta-bancaria';

export function useConta(id: string, aoAlterar: () => void) {
  const [titular, definirTitular] = useState<Titular | null>(null);
  const [saldoEmCentavos, definirSaldo] = useState<number | null>(null);
  const [erro, definirErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([apiContas.consultarTitular(id), apiContas.consultarSaldo(id)])
      .then(([dadosTitular, saldo]) => {
        if (!ativo) return;
        definirTitular(dadosTitular);
        definirSaldo(saldo.saldoEmCentavos);
      })
      .catch((falha: Error) => ativo && definirErro(falha.message));

    // Descarta a resposta se a conta deixar de estar selecionada antes de ela chegar
    return () => {
      ativo = false;
    };
  }, [id]);

  async function executar(operacao: () => Promise<void>) {
    try {
      await operacao();
      definirErro(null);
      aoAlterar();
      return true;
    } catch (falha) {
      definirErro((falha as Error).message);
      return false;
    }
  }

  return {
    titular,
    saldoEmCentavos,
    erro,
    atualizarTitular: (dados: Pick<Titular, 'nome' | 'email'>) =>
      executar(async () => definirTitular(await apiContas.atualizarTitular(id, dados))),
    movimentar: (tipo: TipoMovimentacao, valorEmCentavos: number) =>
      executar(async () => {
        const operacao = tipo === 'deposito' ? apiContas.depositar : apiContas.sacar;
        definirSaldo((await operacao(id, valorEmCentavos)).saldoEmCentavos);
      }),
    encerrar: () => executar(() => apiContas.encerrar(id)),
  };
}
