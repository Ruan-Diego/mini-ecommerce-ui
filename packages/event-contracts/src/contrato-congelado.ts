/**
 * Cópia congelada dos payloads publicados. NÃO edite os tipos existentes aqui.
 *
 * O typecheck exige que cada evento de EventosMini continue compatível com a versão congelada,
 * nos dois sentidos:
 *  - quem emite no formato antigo continua válido (Congelado[E] é atribuível a EventosMini[E]);
 *  - quem ouve no formato antigo continua recebendo tudo que lê (EventosMini[E] é atribuível a Congelado[E]).
 *
 * Adicionar um campo OPCIONAL passa sem mexer aqui. Remover campo, mudar tipo, tornar campo
 * obrigatório ou apagar um evento quebra a compilação: nesse caso crie um evento novo
 * (ex.: 'carrinho:adicionar-item.v2') e acrescente-o abaixo, mantendo o antigo.
 *
 * Este arquivo não é exportado pelo pacote: é só uma checagem de build.
 */
import type { EventosMini } from './index';

type Congelado = {
  'carrinho:adicionar-item': { produtoId: string; quantidade: number };
  'carrinho:atualizado': { quantidadeTotal: number; subtotal: number };
  'carrinho:limpo': Record<string, never>;
  'carrinho:abrir': Record<string, never>;
  'auth:alterado': { autenticado: boolean; nome?: string; papeis: string[] };
  navegar: { rota: string };
};

type Compativel<Atual, Antigo> = [Antigo] extends [Atual] ? ([Atual] extends [Antigo] ? true : false) : false;

type IncompativeisCom<Atual> = {
  [E in keyof Congelado]: E extends keyof Atual ? (Compativel<Atual[E], Congelado[E]> extends true ? never : E) : E;
}[keyof Congelado];

/** Exportado só para tsc --noUnusedLocals não reclamar; vale never quando tudo é compatível. */
export type EventosIncompativeis = IncompativeisCom<EventosMini>;

// Se esta linha não compilar, o tipo do erro mostra quais eventos mudaram de forma incompatível.
const contratoRespeitado: [EventosIncompativeis] extends [never] ? true : EventosIncompativeis = true;
void contratoRespeitado;

/** Para os testes provarem que a checagem pega as mudanças incompatíveis. */
export type _IncompativeisCom<Atual> = IncompativeisCom<Atual>;
export type _Congelado = Congelado;
