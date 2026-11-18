import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { Card } from './Card';
import { Pill } from './Pill';
import { ProductObject } from './ProductObject';
import { violacoesAxe } from './test-utils/axe';

// Componentes sem comportamento próprio: confere as classes do canvas e o axe.
describe('Card', () => {
  it('usa o elemento pedido e a classe card', () => {
    render(
      <Card como="section" aria-label="Resumo do pedido">
        Total
      </Card>,
    );
    expect(screen.getByRole('region', { name: 'Resumo do pedido' })).toHaveClass('card');
  });
});

describe('Pill', () => {
  it.each([
    ['neutro', []],
    ['destaque', ['pill-ac']],
    ['aviso', ['pill-warn']],
    ['erro', ['pill-bad']],
    ['sucesso', ['pill-ok']],
  ] as const)('tom %s aplica as classes certas', (tom, extras) => {
    render(<Pill tom={tom}>Status</Pill>);
    expect(screen.getByText('Status')).toHaveClass('pill', ...extras);
  });
});

describe('ProductObject', () => {
  it.each([
    ['esfera', 'chrome', ['obj', 'chrome']],
    ['anel', 'lime', ['obj', 'lime', 'ring']],
    ['capsula', 'clay', ['obj', 'clay', 'capsule']],
    ['bloco', 'iris', ['obj', 'iris', 'block']],
  ] as const)('%s em %s usa as classes do canvas', (forma, material, classes) => {
    render(<ProductObject forma={forma} material={material} rotulo="Produto" />);
    expect(screen.getByRole('img', { name: 'Produto' })).toHaveClass(...classes);
  });

  it('sem rótulo é decorativo e fica fora da árvore de acessibilidade', () => {
    const { container } = render(<ProductObject />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

describe('componentes visuais', () => {
  it('passam no axe juntos', async () => {
    const { container } = render(
      <Card como="article" aria-label="Esfera Chrome">
        <ProductObject forma="esfera" material="chrome" rotulo="Esfera cromada" />
        <ProductObject forma="anel" material="amber" />
        <Pill tom="destaque">Novo</Pill>
        <Pill tom="aviso">Estoque baixo</Pill>
        <Button>Adicionar ao carrinho</Button>
        <Button variante="secundario" pequeno>
          Ver detalhes
        </Button>
        <Button variante="ghost">Cancelar</Button>
      </Card>,
    );
    expect(await violacoesAxe(container)).toEqual([]);
  });
});
