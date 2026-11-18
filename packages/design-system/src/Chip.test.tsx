import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Chip } from './Chip';
import { violacoesAxe } from './test-utils/axe';

function ChipControlado() {
  const [ativo, setAtivo] = useState(false);
  return (
    <Chip ativo={ativo} onClick={() => setAtivo(!ativo)}>
      Esferas
    </Chip>
  );
}

describe('Chip', () => {
  it('anuncia o estado com aria-pressed e alterna no clique', async () => {
    render(<ChipControlado />);
    const chip = screen.getByRole('button', { name: 'Esferas', pressed: false });
    expect(chip).toHaveAttribute('type', 'button');
    await userEvent.click(chip);
    expect(screen.getByRole('button', { name: 'Esferas', pressed: true })).toHaveClass('chip', 'on');
  });

  it('passa no axe', async () => {
    const { container } = render(
      <>
        <Chip ativo>Todos</Chip>
        <Chip>Anéis</Chip>
      </>,
    );
    expect(await violacoesAxe(container)).toEqual([]);
  });
});
