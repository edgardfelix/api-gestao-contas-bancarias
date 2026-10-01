import { z } from 'zod';

z.config(z.locales.pt());

function cpfValido(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const digitos = [...cpf].map(Number);
  const digitoVerificador = (quantidade: number) => {
    const soma = digitos
      .slice(0, quantidade)
      .reduce((total, digito, indice) => total + digito * (quantidade + 1 - indice), 0);
    return ((soma * 10) % 11) % 10;
  };

  return digitoVerificador(9) === digitos[9] && digitoVerificador(10) === digitos[10];
}

const nome = z.string().trim().min(3, 'Nome deve ter ao menos 3 caracteres');
const email = z.email('E-mail inválido');

export const esquemaAberturaConta = z.object({
  nome,
  cpf: z
    .string()
    .transform((cpf) => cpf.replace(/\D/g, ''))
    .refine(cpfValido, 'CPF inválido'),
  email,
});

export const esquemaAtualizacaoTitular = z
  .object({ nome, email })
  .partial()
  .refine((dados) => dados.nome !== undefined || dados.email !== undefined, 'Informe nome ou e-mail');

export const esquemaMovimentacao = z.object({
  valorEmCentavos: z.int('Informe o valor em centavos (número inteiro)').positive('O valor deve ser maior que zero'),
});
