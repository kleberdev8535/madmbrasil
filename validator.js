"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCpf = validateCpf;
function validateCpf(raw) {
    // 1. Remover tudo que não for dígito
    const digits = raw.replace(/\D/g, '');
    // 2. Verificar se tem exatamente 11 dígitos
    if (digits.length !== 11) {
        return { valid: false, formatted: null, error: 'CPF deve conter exatamente 11 dígitos' };
    }
    // 3. Rejeitar sequências com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(digits)) {
        return { valid: false, formatted: null, error: 'CPF inválido: todos os dígitos são iguais' };
    }
    // 4. Calcular dígito verificador 1
    const sum1 = digits.slice(0, 9).split('').reduce((acc, d, idx) => acc + Number(d) * (10 - idx), 0);
    const remainder1 = sum1 % 11;
    const check1 = remainder1 < 2 ? 0 : 11 - remainder1;
    if (check1 !== Number(digits[9])) {
        return { valid: false, formatted: null, error: 'Dígitos verificadores inválidos' };
    }
    // 5. Calcular dígito verificador 2
    const sum2 = digits.slice(0, 10).split('').reduce((acc, d, idx) => acc + Number(d) * (11 - idx), 0);
    const remainder2 = sum2 % 11;
    const check2 = remainder2 < 2 ? 0 : 11 - remainder2;
    if (check2 !== Number(digits[10])) {
        return { valid: false, formatted: null, error: 'Dígitos verificadores inválidos' };
    }
    // 7. Retornar formatado no padrão 000.000.000-00
    const formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    return { valid: true, formatted, error: null };
}
