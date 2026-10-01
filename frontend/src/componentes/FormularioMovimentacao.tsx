import { useState, type FormEvent } from 'react';
import type { TipoMovimentacao } from '../tipos/conta-bancaria';
import { reaisParaCentavos } from '../utilitarios/formatadores';

interface Propriedades {
  aoMovimentar: (tipo: TipoMovimentacao, valorEmCentavos: number) => Promise<boolean>;
}

export function FormularioMovimentacao({ aoMovimentar }: Propriedades) {
  const [tipo, definirTipo] = useState<TipoMovimentacao>('deposito');
  const [valor, definirValor] = useState('');

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (await aoMovimentar(tipo, reaisParaCentavos(valor))) definirValor('');
  }

  return (
    <form className="linha" onSubmit={enviar}>
      <select
        aria-label="Tipo de movimentação"
        value={tipo}
        onChange={(evento) => definirTipo(evento.target.value as TipoMovimentacao)}
      >
        <option value="deposito">Depósito</option>
        <option value="saque">Saque</option>
      </select>
      <input
        aria-label="Valor em reais"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0,00"
        value={valor}
        onChange={(evento) => definirValor(evento.target.value)}
        required
      />
      <button>Confirmar</button>
    </form>
  );
}
