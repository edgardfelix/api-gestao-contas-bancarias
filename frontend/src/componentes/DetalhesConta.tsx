import type { FormEvent } from 'react';
import { useConta } from '../hooks/useConta';
import type { ContaBancaria } from '../tipos/conta-bancaria';
import { formatarCpf, formatarData, formatarMoeda } from '../utilitarios/formatadores';
import { FormularioMovimentacao } from './FormularioMovimentacao';

interface Propriedades {
  conta: ContaBancaria;
  aoAlterar: () => void;
}

export function DetalhesConta({ conta, aoAlterar }: Propriedades) {
  const { titular, saldoEmCentavos, erro, atualizarTitular, movimentar, encerrar } = useConta(conta.id, aoAlterar);

  function salvarTitular(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    atualizarTitular({ nome: String(dados.get('nome')), email: String(dados.get('email')) });
  }

  function confirmarEncerramento() {
    if (confirm('Encerrar esta conta? A operação não pode ser desfeita.')) encerrar();
  }

  if (!titular || saldoEmCentavos === null) {
    return <section className="cartao">{erro ? <p className="erro">{erro}</p> : <p>Carregando...</p>}</section>;
  }

  return (
    <section className="cartao">
      <h2>{titular.nome}</h2>
      <p>
        CPF {formatarCpf(titular.cpf)} · aberta em {formatarData(conta.criadaEm)} · {conta.status}
      </p>
      <p className="saldo">{formatarMoeda(saldoEmCentavos)}</p>

      <fieldset disabled={conta.status === 'ENCERRADA'}>
        <FormularioMovimentacao aoMovimentar={movimentar} />

        <form onSubmit={salvarTitular}>
          <label>
            Nome
            <input name="nome" defaultValue={titular.nome} required />
          </label>
          <label>
            E-mail
            <input name="email" type="email" defaultValue={titular.email} required />
          </label>
          <button>Salvar titular</button>
        </form>

        <button type="button" onClick={confirmarEncerramento}>
          Encerrar conta
        </button>
      </fieldset>

      {erro && <p className="erro">{erro}</p>}
    </section>
  );
}
