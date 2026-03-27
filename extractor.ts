export interface ExtractedData {
  nome: string | null;
  nacionalidade: string | null;
  estadoCivil: string | null;
  profissao: string | null;
  cpf: string | null;
  rg: string | null;
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  cidade: string | null;
  uf: string | null;
}

// Cada entrada: regex que captura o VALOR no grupo 1, testada contra cada linha
const LINE_EXTRACTORS: Array<{ field: keyof ExtractedData; re: RegExp }> = [
  { field: 'nome',          re: /^nome(?:\s+completo)?\s+(.+)/i },
  { field: 'nacionalidade', re: /^nacionalidade\s+(.+)/i },
  { field: 'estadoCivil',   re: /^estado\s*civil\s+(.+)/i },
  { field: 'profissao',     re: /^profiss[aã]o(?:\s+atual)?\s+(.+)/i },
  { field: 'rg',            re: /^rg\s+(.+)/i },
  { field: 'cpf',           re: /^cpf\s+(.+)/i },
  { field: 'rua',           re: /^rua\s+(.+)/i },
  { field: 'rua',           re: /^avenida\s+(.+)/i },
  { field: 'rua',           re: /^logradouro\s+(.+)/i },
  { field: 'numero',        re: /^n[uú]mero\s+(.+)/i },
  { field: 'complemento',   re: /^complemento\s+(.+)/i },
  { field: 'bairro',        re: /^bairro\s+(.+)/i },
  { field: 'cep',           re: /^cep\s+(.+)/i },
  { field: 'cidade',        re: /^cidade\s+(.+)/i },
  { field: 'uf',            re: /^uf\s+(.+)/i },
];

const CPF_RE = /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?\d{2}\b/;
const CEP_RE = /\b\d{5}-?\d{3}\b/;
const RG_RE  = /\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dXx]?\b/;

function normalize(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]+/g, ' ').trim();
}

export function extractData(rawText: string): ExtractedData {
  const text  = normalize(rawText);
  const lines = text.split('\n');

  const result: ExtractedData = {
    nome: null, nacionalidade: null, estadoCivil: null, profissao: null,
    cpf: null, rg: null, rua: null, numero: null, complemento: null,
    bairro: null, cep: null, cidade: null, uf: null,
  };

  // Passo 1: testar cada linha contra os extratores de rótulo
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    for (const ext of LINE_EXTRACTORS) {
      const m = trimmed.match(ext.re);
      if (m) {
        const value = m[1].trim();
        if (value && !result[ext.field]) {
          (result[ext.field] as string) = value;
        }
        break;
      }
    }
  }

  // Passo 2: fallback regex para campos ainda vazios
  if (!result.cpf) {
    const m = text.match(CPF_RE);
    if (m) result.cpf = m[0].trim();
  }
  if (!result.cep) {
    const m = text.match(CEP_RE);
    if (m) result.cep = m[0].trim();
  }
  if (!result.rg) {
    for (const line of lines) {
      if (/\bRG\b/i.test(line)) {
        const m = line.match(RG_RE);
        if (m) { result.rg = m[0].trim(); break; }
      }
    }
  }

  return result;
}
