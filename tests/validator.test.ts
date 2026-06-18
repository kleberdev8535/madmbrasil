import { validateCpf } from '../src/validator';

describe('validateCpf', () => {
  it('aceita CPF válido formatado', () => {
    const result = validateCpf('529.982.247-25');
    expect(result.valid).toBe(true);
    expect(result.formatted).toBe('529.982.247-25');
    expect(result.error).toBeNull();
  });

  it('aceita CPF válido sem formatação', () => {
    const result = validateCpf('52998224725');
    expect(result.valid).toBe(true);
    expect(result.formatted).toBe('529.982.247-25');
  });

  it('rejeita CPF com todos os dígitos iguais', () => {
    expect(validateCpf('111.111.111-11').valid).toBe(false);
    expect(validateCpf('00000000000').valid).toBe(false);
  });

  it('rejeita CPF com menos de 11 dígitos', () => {
    const result = validateCpf('123.456.789');
    expect(result.valid).toBe(false);
    expect(result.formatted).toBeNull();
  });

  it('rejeita CPF com dígitos verificadores errados', () => {
    const result = validateCpf('529.982.247-26');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Dígitos verificadores inválidos');
  });

  it('retorna formatted no padrão 000.000.000-00', () => {
    const result = validateCpf('52998224725');
    expect(result.formatted).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  });
});
