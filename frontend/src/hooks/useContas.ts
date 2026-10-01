import { useCallback, useEffect, useState } from 'react';
import { apiContas } from '../servicos/api-contas';
import type { ContaBancaria, Titular } from '../tipos/conta-bancaria';

export function useContas() {
  const [contas, definirContas] = useState<ContaBancaria[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      definirContas(await apiContas.listar());
      definirErro(null);
    } catch (falha) {
      definirErro((falha as Error).message);
    } finally {
      definirCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  async function abrir(titular: Titular) {
    const conta = await apiContas.abrir(titular);
    definirContas((atuais) => [...atuais, conta]);
    return conta;
  }

  return { contas, carregando, erro, recarregar, abrir };
}
