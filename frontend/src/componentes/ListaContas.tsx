import type { ContaBancaria } from '../tipos/conta-bancaria';
import { formatarCpf } from '../utilitarios/formatadores';

interface Propriedades {
  contas: ContaBancaria[];
  idSelecionado: string | null;
  aoSelecionar: (id: string) => void;
}

export function ListaContas({ contas, idSelecionado, aoSelecionar }: Propriedades) {
  if (contas.length === 0) return <p>Nenhuma conta aberta ainda.</p>;

  return (
    <ul className="lista">
      {contas.map((conta) => (
        <li key={conta.id}>
          <button aria-pressed={conta.id === idSelecionado} onClick={() => aoSelecionar(conta.id)}>
            <span>{conta.titular.nome}</span>
            <span>{formatarCpf(conta.titular.cpf)}</span>
            <span>{conta.status}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
