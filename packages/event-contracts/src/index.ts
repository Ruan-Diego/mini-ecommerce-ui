/**
 * Contratos de eventos entre microfrontends.
 * Regra: uma mudança incompatível num payload exige um NOVO nome de evento.
 */
export type EventosMini = {
  /** Emitido pelo catálogo (e pela conta, em "Comprar novamente"). Ouvido pelo carrinho. */
  'carrinho:adicionar-item': { produtoId: string; quantidade: number };
  /** Emitido pelo carrinho após qualquer alteração. Ouvido pelo shell (badge). */
  'carrinho:atualizado': { quantidadeTotal: number; subtotal: number };
  /** Emitido pelo checkout na tela Pedido confirmado. */
  'carrinho:limpo': Record<string, never>;
  /** Emitido pelo shell ao clicar no ícone do carrinho. */
  'carrinho:abrir': Record<string, never>;
  /** Emitido pelo shell quando o login muda. */
  'auth:alterado': { autenticado: boolean; nome?: string; papeis: string[] };
  /** Pedido de navegação de um MFE para uma rota de outro. */
  navegar: { rota: string };
};

export type NomeEvento = keyof EventosMini;

export interface EventBus {
  emit<E extends NomeEvento>(evento: E, payload: EventosMini[E]): void;
  on<E extends NomeEvento>(evento: E, ouvinte: (payload: EventosMini[E]) => void): () => void;
}

/** Props que o shell passa para o módulo ./App de cada microfrontend. */
export interface PropsRemoto {
  basePath: string;
  getToken: () => Promise<string | null>;
  eventBus: EventBus;
}

export function criarEventBus(alvo: EventTarget = window): EventBus {
  return {
    emit(evento, payload) {
      alvo.dispatchEvent(new CustomEvent(evento, { detail: payload }));
    },
    on(evento, ouvinte) {
      const handler = (e: Event) => ouvinte((e as CustomEvent).detail);
      alvo.addEventListener(evento, handler);
      return () => alvo.removeEventListener(evento, handler);
    },
  };
}
