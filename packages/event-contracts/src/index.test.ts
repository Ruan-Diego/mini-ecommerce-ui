import { criarEventBus, emit, on, type EventosMini } from './index';
import type { _Congelado, _IncompativeisCom } from './contrato-congelado';

// Os @ts-expect-error e expectTypeOf deste arquivo são verificados pelo `pnpm typecheck`
// (o vitest só executa a parte de runtime).

describe('emit e on', () => {
  it('entregam o payload tipado e permitem cancelar a inscrição', () => {
    const alvo = new EventTarget();
    const vistos: string[] = [];
    const sair = on('carrinho:adicionar-item', (p) => vistos.push(p.produtoId), alvo);
    emit('carrinho:adicionar-item', { produtoId: 'orbe-cromo', quantidade: 1 }, alvo);
    sair();
    emit('carrinho:adicionar-item', { produtoId: 'anel-iris', quantidade: 1 }, alvo);
    expect(vistos).toEqual(['orbe-cromo']);
  });

  it('usam CustomEvent com o nome do evento e o payload em detail', () => {
    const alvo = new EventTarget();
    let recebido: Event | undefined;
    alvo.addEventListener('navegar', (e) => (recebido = e));
    emit('navegar', { rota: '/carrinho' }, alvo);
    expect(recebido).toBeInstanceOf(CustomEvent);
    expect((recebido as CustomEvent).detail).toEqual({ rota: '/carrinho' });
  });

  it('não misturam eventos de nomes diferentes', () => {
    const alvo = new EventTarget();
    const ouvinte = vi.fn();
    on('carrinho:abrir', ouvinte, alvo);
    emit('carrinho:limpo', {}, alvo);
    expect(ouvinte).not.toHaveBeenCalled();
  });
});

describe('criarEventBus', () => {
  it('isola o bus no alvo recebido', () => {
    const a = criarEventBus(new EventTarget());
    const b = criarEventBus(new EventTarget());
    const ouvinte = vi.fn();
    b.on('auth:alterado', ouvinte);
    a.emit('auth:alterado', { autenticado: true, papeis: ['cliente'] });
    expect(ouvinte).not.toHaveBeenCalled();
    b.emit('auth:alterado', { autenticado: false, papeis: [] });
    expect(ouvinte).toHaveBeenCalledWith({ autenticado: false, papeis: [] });
  });

  it('infere o tipo do payload no ouvinte', () => {
    const bus = criarEventBus(new EventTarget());
    bus.on('carrinho:atualizado', (p) => {
      expectTypeOf(p).toEqualTypeOf<{ quantidadeTotal: number; subtotal: number }>();
    });
  });
});

describe('payload errado não compila', () => {
  it('rejeita campo faltando, tipo errado, campo a mais e evento inexistente', () => {
    const bus = criarEventBus(new EventTarget());
    // @ts-expect-error quantidade é obrigatória
    bus.emit('carrinho:adicionar-item', { produtoId: 'x' });
    // @ts-expect-error quantidade é number
    emit('carrinho:adicionar-item', { produtoId: 'x', quantidade: '1' }, new EventTarget());
    // @ts-expect-error carrinho:limpo não tem payload
    bus.emit('carrinho:limpo', { motivo: 'pedido' });
    // @ts-expect-error evento que não existe no contrato
    bus.emit('carrinho:remover-item', { produtoId: 'x' });
    // @ts-expect-error o ouvinte não pode ler campo que o payload não tem
    bus.on('navegar', (p) => p.destino);
    expect(true).toBe(true);
  });
});

describe('contrato congelado', () => {
  type Mudar<E extends keyof _Congelado, P> = Omit<_Congelado, E> & Record<E, P>;

  it('aceita o contrato atual', () => {
    expectTypeOf<_IncompativeisCom<EventosMini>>().toBeNever();
  });

  it('aceita adicionar campo opcional', () => {
    type ComOpcional = Mudar<'navegar', { rota: string; substituir?: boolean }>;
    expectTypeOf<_IncompativeisCom<ComOpcional>>().toBeNever();
  });

  it('acusa campo removido, tipo trocado, campo obrigatório novo e evento apagado', () => {
    type SemCampo = Mudar<'carrinho:atualizado', { quantidadeTotal: number }>;
    type TipoTrocado = Mudar<'carrinho:adicionar-item', { produtoId: number; quantidade: number }>;
    type NovoObrigatorio = Mudar<'navegar', { rota: string; origem: string }>;
    type SemEvento = Omit<_Congelado, 'carrinho:abrir'>;

    expectTypeOf<_IncompativeisCom<SemCampo>>().toEqualTypeOf<'carrinho:atualizado'>();
    expectTypeOf<_IncompativeisCom<TipoTrocado>>().toEqualTypeOf<'carrinho:adicionar-item'>();
    expectTypeOf<_IncompativeisCom<NovoObrigatorio>>().toEqualTypeOf<'navegar'>();
    expectTypeOf<_IncompativeisCom<SemEvento>>().toEqualTypeOf<'carrinho:abrir'>();
  });
});
