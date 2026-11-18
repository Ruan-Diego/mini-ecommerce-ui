import axe from 'axe-core';

/**
 * Roda o axe no trecho renderizado e devolve as violações em texto (lista vazia = acessível).
 * color-contrast fica desligado: o jsdom não calcula estilos nem renderiza, então essa regra
 * não funciona aqui. O contraste dos tokens é conferido à parte (contraste.test.ts).
 */
export async function violacoesAxe(container: Element): Promise<string[]> {
  const resultado = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
  return resultado.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.html).join(' | ')})`);
}
