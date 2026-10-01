const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatarMoeda = (centavos: number) => moeda.format(centavos / 100);

export const formatarCpf = (cpf: string) => cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

export const formatarData = (dataIso: string) => new Date(dataIso).toLocaleDateString('pt-BR');

export const reaisParaCentavos = (reais: string) => Math.round(Number(reais) * 100);
