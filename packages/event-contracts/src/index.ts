/**
 * Contratos de eventos entre microfrontends.
 * Regra: uma mudança incompatível num payload exige um NOVO nome de evento
 * (verificada em tempo de compilação por contrato-congelado.ts).
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

export type Ouvinte<E extends NomeEvento> = (payload: EventosMini[E]) => void;

/** Emite um evento tipado como CustomEvent. Payload errado para o nome do evento não compila. */
export function emit<E extends NomeEvento>(evento: E, payload: EventosMini[E], alvo: EventTarget = window): void {
  alvo.dispatchEvent(new CustomEvent(evento, { detail: payload }));
}

/** Ouve um evento tipado. Devolve a função que cancela a inscrição. */
export function on<E extends NomeEvento>(evento: E, ouvinte: Ouvinte<E>, alvo: EventTarget = window): () => void {
  const handler = (e: Event) => ouvinte((e as CustomEvent<EventosMini[E]>).detail);
  alvo.addEventListener(evento, handler);
  return () => alvo.removeEventListener(evento, handler);
}

export interface EventBus {
  emit<E extends NomeEvento>(evento: E, payload: EventosMini[E]): void;
  on<E extends NomeEvento>(evento: E, ouvinte: Ouvinte<E>): () => void;
}

/** Props que o shell passa para o módulo ./App de cada microfrontend. */
export interface PropsRemoto {
  basePath: string;
  getToken: () => Promise<string | null>;
  eventBus: EventBus;
}

/**
 * Event bus preso a um alvo. O shell cria um sobre window e passa para os MFEs;
 * no modo standalone e nos testes, use um EventTarget próprio.
 */
export function criarEventBus(alvo: EventTarget = window): EventBus {
  return {
    emit: (evento, payload) => emit(evento, payload, alvo),
    on: (evento, ouvinte) => on(evento, ouvinte, alvo),
  };
}
