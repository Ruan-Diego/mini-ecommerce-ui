import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from './Modal.js';
import { violacoesAxe } from './test-utils/axe';

function Exemplo() {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setAberto(true)}>
        Remover item
      </button>
      <Modal aberto={aberto} titulo="Remover do carrinho?" aoFechar={() => setAberto(false)}>
        <p>A Esfera Chrome sai do seu carrinho.</p>
        <button type="button" onClick={() => setAberto(false)}>
          Confirmar
        </button>
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('não renderiza nada fechado', () => {
    render(<Exemplo />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('abre com título acessível e foco no diálogo', async () => {
    render(<Exemplo />);
    await userEvent.click(screen.getByRole('button', { name: 'Remover item' }));
    const dialogo = screen.getByRole('dialog', { name: 'Remover do carrinho?' });
    expect(dialogo).toHaveAttribute('aria-modal', 'true');
    expect(dialogo).toHaveFocus();
  });

  it('Esc fecha e devolve o foco para quem abriu', async () => {
    render(<Exemplo />);
    const abrir = screen.getByRole('button', { name: 'Remover item' });
    await userEvent.click(abrir);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(abrir).toHaveFocus();
  });

  it('prende o Tab dentro do diálogo', async () => {
    render(<Exemplo />);
    await userEvent.click(screen.getByRole('button', { name: 'Remover item' }));
    const fechar = screen.getByRole('button', { name: 'Fechar' });
    const confirmar = screen.getByRole('button', { name: 'Confirmar' });
    await userEvent.tab();
    expect(fechar).toHaveFocus();
    await userEvent.tab();
    expect(confirmar).toHaveFocus();
    await userEvent.tab();
    expect(fechar).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(confirmar).toHaveFocus();
  });

  it('fecha pelo botão Fechar', async () => {
    render(<Exemplo />);
    await userEvent.click(screen.getByRole('button', { name: 'Remover item' }));
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('passa no axe aberto', async () => {
    const { container } = render(<Exemplo />);
    await userEvent.click(screen.getByRole('button', { name: 'Remover item' }));
    expect(await violacoesAxe(container)).toEqual([]);
  });
});
