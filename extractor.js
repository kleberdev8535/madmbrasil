"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractData = extractData;
const PATTERNS = {
    cpf: /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?\d{2}\b/,
    cep: /\b\d{5}-?\d{3}\b/,
    rg: /\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dXx]\b/,
};
const NOME_KEYWORDS = /^(?:nome(?:\s+completo)?|titular)\s*:/i;
const ENDERECO_KEYWORDS = /^(?:endere[cç]o|residente\s+em|rua|av\.|avenida)\s*[:\s]/i;
/**
 * Normaliza o texto removendo espaços extras e quebras de linha estranhas.
 */
function normalize(text) {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .trim();
}
/**
 * Extrai o valor na mesma linha após a palavra-chave, ou na linha seguinte se vazia.
 */
function extractAfterKeyword(lines, keywordRegex) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (keywordRegex.test(line)) {
            // Tenta pegar o valor após os dois-pontos na mesma linha
            const colonIdx = line.indexOf(':');
            if (colonIdx !== -1) {
                const inline = line.slice(colonIdx + 1).trim();
                if (inline.length > 0)
                    return inline;
            }
            // Caso contrário, pega a próxima linha não-vazia
            for (let j = i + 1; j < lines.length; j++) {
                const next = lines[j].trim();
                if (next.length > 0)
                    return next;
            }
        }
    }
    return null;
}
/**
 * Heurística de nome próprio: linha que começa com letras maiúsculas e não contém dígitos.
 * Usada como fallback quando não há palavra-chave.
 */
function extractNomeHeuristic(lines) {
    const properNameRegex = /^[A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇ][a-záéíóúàâêôãõüç]+(?:\s+[A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇ][a-záéíóúàâêôãõüç]+)+$/;
    for (const line of lines) {
        const trimmed = line.trim();
        if (properNameRegex.test(trimmed)) {
            return trimmed;
        }
    }
    return null;
}
/**
 * Heurística de endereço: linha que começa com "Rua", "Av.", "Avenida", etc. sem palavra-chave explícita.
 */
function extractEnderecoHeuristic(lines) {
    const streetRegex = /^(?:rua|av\.|avenida|alameda|travessa|estrada|rodovia|praça)\s+/i;
    for (const line of lines) {
        const trimmed = line.trim();
        if (streetRegex.test(trimmed)) {
            return trimmed;
        }
    }
    return null;
}
/**
 * Função pura que extrai dados pessoais de um texto bruto.
 * Sem efeitos colaterais, sem I/O.
 */
function extractData(rawText) {
    const text = normalize(rawText);
    const lines = text.split('\n');
    // CPF
    const cpfMatch = text.match(PATTERNS.cpf);
    const cpf = cpfMatch ? cpfMatch[0].trim() : null;
    // CEP
    const cepMatch = text.match(PATTERNS.cep);
    const cep = cepMatch ? cepMatch[0].trim() : null;
    // RG — busca próximo a palavras-chave primeiro
    let rg = null;
    const rgKeywordRegex = /\b(?:RG|R\.G\.|Identidade|Registro\s+Geral)\b/i;
    for (const line of lines) {
        if (rgKeywordRegex.test(line)) {
            const match = line.match(PATTERNS.rg);
            if (match) {
                rg = match[0].trim();
                break;
            }
        }
    }
    // Fallback: busca RG em qualquer linha
    if (!rg) {
        const rgMatch = text.match(PATTERNS.rg);
        rg = rgMatch ? rgMatch[0].trim() : null;
    }
    // Nome — palavra-chave primeiro, depois heurística
    const nome = extractAfterKeyword(lines, NOME_KEYWORDS) ?? extractNomeHeuristic(lines);
    // Endereço — palavra-chave primeiro, depois heurística
    const endereco = extractAfterKeyword(lines, ENDERECO_KEYWORDS) ?? extractEnderecoHeuristic(lines);
    return { nome, cpf, rg, endereco, cep };
}
