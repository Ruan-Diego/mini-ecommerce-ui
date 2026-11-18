import { render, screen } from '@testing-library/react';
import { Button } from './Button.js';

describe('Button', () => {
  it('usa type="button" e a classe da variante', () => {
    render(<Button variante="secundario" pequeno>Adicionar</Button>);
    const botao = screen.getByRole('button', { name: 'Adicionar' });
    expect(botao).toHaveAttribute('type', 'button');
    expect(botao).toHaveClass('btn', 'btn-sec', 'btn-sm');
  });
});
