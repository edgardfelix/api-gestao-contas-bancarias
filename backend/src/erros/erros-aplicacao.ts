export abstract class ErroAplicacao extends Error {
  abstract readonly status: number;

  constructor(
    readonly codigo: string,
    mensagem: string,
  ) {
    super(mensagem);
  }
}

export class ErroNaoEncontrado extends ErroAplicacao {
  readonly status = 404;
}

export class ErroConflito extends ErroAplicacao {
  readonly status = 409;
}

export class ErroRegraNegocio extends ErroAplicacao {
  readonly status = 422;
}
