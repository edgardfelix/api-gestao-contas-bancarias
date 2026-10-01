import { useState } from 'react';
import { DetalhesConta } from './componentes/DetalhesConta';
import { FormularioConta } from './componentes/FormularioConta';
import { ListaContas } from './componentes/ListaContas';
import { useContas } from './hooks/useContas';
import type { Titular } from './tipos/conta-bancaria';

export function Aplicacao() {
  const { contas, carregando, erro, recarregar, abrir } = useContas();
  const [idSelecionado, definirIdSelecionado] = useState<string | null>(null);
  const contaSelecionada = contas.find((conta) => conta.id === idSelecionado);

  async function abrirConta(titular: Titular) {
    const conta = await abrir(titular);
    definirIdSelecionado(conta.id);
  }

  return (
    <main>
      <h1>Gestão de Contas Bancárias</h1>

      <div className="grade">
        <div className="coluna">
          <FormularioConta aoAbrir={abrirConta} />

          <section className="cartao">
            <h2>Contas</h2>
            {carregando && <p>Carregando...</p>}
            {erro && <p className="erro">{erro}</p>}
            {!carregando && !erro && (
              <ListaContas contas={contas} idSelecionado={idSelecionado} aoSelecionar={definirIdSelecionado} />
            )}
          </section>
        </div>

        {contaSelecionada ? (
          <DetalhesConta key={contaSelecionada.id} conta={contaSelecionada} aoAlterar={recarregar} />
        ) : (
          <section className="cartao">
            <p>Selecione uma conta para consultar titular e saldo.</p>
          </section>
        )}
      </div>
    </main>
  );
}
