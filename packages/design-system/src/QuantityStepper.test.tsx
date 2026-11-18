import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { QuantityStepper } from './QuantityStepper.js';
import { violacoesAxe } from './test-utils/axe';

function StepperControlado({ inicial, max }: { inicial: number; max?: number }) {
  const [valor, setValor] = useState(inicial);
  return <QuantityStepper valor={valor} aoMudar={setValor} max={max} rotulo="Quantidade de Esfera Chrome" />;
}

describe('QuantityStepper', () => {
  it('aumenta e diminui o valor', async () => {
    render(<StepperControlado inicial={2} />);
    const grupo = screen.getByRole('group', { name: 'Quantidade de Esfera Chrome' });
    await userEvent.click(screen.getByRole('button', { name: 'Aumentar quantidade' }));
    expect(grupo).toHaveTextContent('3');
    await userEvent.click(screen.getByRole('button', { name: 'Diminuir quantidade' }));
    await userEvent.click(screen.getByRole('button', { name: 'Diminuir quantidade' }));
    expect(grupo).toHaveTextContent('1');
  });

  it('desabilita os botões nos limites', () => {
    render(<StepperControlado inicial={1} max={1} />);
    expect(screen.getByRole('button', { name: 'Diminuir quantidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Aumentar quantidade' })).toBeDisabled();
  });

  it('passa no axe', async () => {
    const { container } = render(<StepperControlado inicial={2} />);
    expect(await violacoesAxe(container)).toEqual([]);
  });
});
