import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErroAplicacao } from '../erros/erros-aplicacao';

export function tratadorErros(erro: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (erro instanceof ErroAplicacao) {
    return enviarErro(res, erro.status, erro.codigo, erro.message);
  }

  if (erro instanceof ZodError) {
    const detalhes = erro.issues.map((issue) => ({ campo: issue.path.join('.'), mensagem: issue.message }));
    return enviarErro(res, 400, 'DADOS_INVALIDOS', 'Os dados enviados são inválidos.', detalhes);
  }

  // Lançado pelo express.json() quando o corpo não é um JSON válido
  if (erro instanceof SyntaxError) {
    return enviarErro(res, 400, 'JSON_INVALIDO', 'O corpo da requisição não é um JSON válido.');
  }

  console.error(erro);
  enviarErro(res, 500, 'ERRO_INTERNO', 'Erro interno do servidor.');
}

function enviarErro(res: Response, status: number, codigo: string, mensagem: string, detalhes?: unknown) {
  res.status(status).json({ erro: { codigo, mensagem, detalhes } });
}
