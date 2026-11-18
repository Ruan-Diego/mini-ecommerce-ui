// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// O axe não mede contraste no jsdom; aqui a razão WCAG é calculada direto dos tokens.
const css = readFileSync(fileURLToPath(new URL('./tokens.css', import.meta.url)), 'utf8');

function token(nome: string): string {
  const achado = css.match(new RegExp(`--${nome}:(#[0-9a-fA-F]{6})`));
  if (!achado) throw new Error(`token --${nome} não encontrado`);
  return achado[1];
}

function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

// [texto, fundo, onde aparece]. AA para texto normal: 4.5:1.
const pares: Array<[string, string, string]> = [
  ['tx', 'bg', 'texto principal'],
  ['tx', 's1', 'texto em card e input'],
  ['tx', 's2', 'item ativo do menu admin'],
  ['mu', 'bg', 'texto secundário'],
  ['mu', 's1', 'label e texto secundário em card'],
  ['acInk', 'ac', 'botão primário e pill de destaque'],
  ['ac', 'bg', 'texto de destaque'],
  ['warn', 'bg', 'pill de aviso'],
  ['bad', 'bg', 'pill e mensagem de erro'],
  ['bad', 's1', 'erro dentro de card'],
  ['ok', 'bg', 'pill de sucesso'],
  ['bg', 'tx', 'chip ativo'],
];

describe('contraste dos tokens (WCAG AA)', () => {
  it.each(pares)('--%s sobre --%s (%s) tem pelo menos 4.5:1', (texto, fundo) => {
    expect(contraste(token(texto), token(fundo))).toBeGreaterThanOrEqual(4.5);
  });
});
