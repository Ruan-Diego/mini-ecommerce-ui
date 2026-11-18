import { criarEventBus } from './index';

describe('criarEventBus', () => {
  it('entrega o payload tipado e permite cancelar a inscrição', () => {
    const bus = criarEventBus(new EventTarget());
    const vistos: string[] = [];
    const sair = bus.on('carrinho:adicionar-item', (p) => vistos.push(p.produtoId));
    bus.emit('carrinho:adicionar-item', { produtoId: 'orbe-cromo', quantidade: 1 });
    sair();
    bus.emit('carrinho:adicionar-item', { produtoId: 'anel-iris', quantidade: 1 });
    expect(vistos).toEqual(['orbe-cromo']);
  });

  it('não compila com payload errado', () => {
    const bus = criarEventBus(new EventTarget());
    // @ts-expect-error quantidade é obrigatória
    bus.emit('carrinho:adicionar-item', { produtoId: 'x' });
    expect(true).toBe(true);
  });
});
