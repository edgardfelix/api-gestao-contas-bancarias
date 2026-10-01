import type { Request, Response } from 'express';
import type { ServicoContas } from '../servicos/servico-contas';
import { esquemaAberturaConta, esquemaAtualizacaoTitular, esquemaMovimentacao } from '../validacao/esquemas-conta';

type RequisicaoComId = Request<{ id: string }>;

export class ControladorContas {
  constructor(private readonly servico: ServicoContas) {}

  abrir = async (req: Request, res: Response) => {
    const titular = esquemaAberturaConta.parse(req.body);
    res.status(201).json(await this.servico.abrir(titular));
  };

  listar = async (_req: Request, res: Response) => {
    res.json(await this.servico.listar());
  };

  buscar = async (req: RequisicaoComId, res: Response) => {
    res.json(await this.servico.buscar(req.params.id));
  };

  consultarTitular = async (req: RequisicaoComId, res: Response) => {
    const { titular } = await this.servico.buscar(req.params.id);
    res.json(titular);
  };

  atualizarTitular = async (req: RequisicaoComId, res: Response) => {
    const dados = esquemaAtualizacaoTitular.parse(req.body);
    res.json(await this.servico.atualizarTitular(req.params.id, dados));
  };

  consultarSaldo = async (req: RequisicaoComId, res: Response) => {
    const { saldoEmCentavos } = await this.servico.buscar(req.params.id);
    res.json({ saldoEmCentavos });
  };

  depositar = async (req: RequisicaoComId, res: Response) => {
    const { valorEmCentavos } = esquemaMovimentacao.parse(req.body);
    res.json({ saldoEmCentavos: await this.servico.depositar(req.params.id, valorEmCentavos) });
  };

  sacar = async (req: RequisicaoComId, res: Response) => {
    const { valorEmCentavos } = esquemaMovimentacao.parse(req.body);
    res.json({ saldoEmCentavos: await this.servico.sacar(req.params.id, valorEmCentavos) });
  };

  encerrar = async (req: RequisicaoComId, res: Response) => {
    await this.servico.encerrar(req.params.id);
    res.status(204).end();
  };
}
