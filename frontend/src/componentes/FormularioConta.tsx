import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Titular } from '../tipos/conta-bancaria';

interface Propriedades {
  aoAbrir: (titular: Titular) => Promise<void>;
}

const titularVazio: Titular = { nome: '', cpf: '', email: '' };

export function FormularioConta({ aoAbrir }: Propriedades) {
  const [titular, definirTitular] = useState(titularVazio);
  const [erro, definirErro] = useState<string | null>(null);
  const [enviando, definirEnviando] = useState(false);

  function alterar(evento: ChangeEvent<HTMLInputElement>) {
    definirTitular({ ...titular, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    definirEnviando(true);

    try {
      await aoAbrir(titular);
      definirTitular(titularVazio);
      definirErro(null);
    } catch (falha) {
      definirErro((falha as Error).message);
    } finally {
      definirEnviando(false);
    }
  }

  return (
    <form className="cartao" onSubmit={enviar}>
      <h2>Abrir conta</h2>
      <label>
        Nome
        <input name="nome" value={titular.nome} onChange={alterar} required />
      </label>
      <label>
        CPF
        <input name="cpf" value={titular.cpf} onChange={alterar} placeholder="000.000.000-00" required />
      </label>
      <label>
        E-mail
        <input name="email" type="email" value={titular.email} onChange={alterar} required />
      </label>
      {erro && <p className="erro">{erro}</p>}
      <button disabled={enviando}>{enviando ? 'Abrindo...' : 'Abrir conta'}</button>
    </form>
  );
}
