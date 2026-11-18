import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import { violacoesAxe } from './test-utils/axe';

describe('Input', () => {
  it('liga o label ao campo e aceita digitação', async () => {
    render(<Input label="CEP" name="cep" />);
    const campo = screen.getByLabelText('CEP');
    await userEvent.type(campo, '01310-100');
    expect(campo).toHaveValue('01310-100');
    expect(campo).toHaveClass('input');
    expect(campo).not.toHaveAttribute('aria-invalid');
  });

  it('com erro, marca o campo como inválido e descreve o erro', () => {
    render(<Input label="E-mail" erro="Informe um e-mail válido" />);
    const campo = screen.getByLabelText('E-mail');
    expect(campo).toHaveAttribute('aria-invalid', 'true');
    expect(campo).toHaveClass('err');
    expect(campo).toHaveAccessibleDescription('Informe um e-mail válido');
  });

  it('passa no axe, com e sem erro', async () => {
    const { container } = render(
      <>
        <Input label="Nome" />
        <Input label="Número" erro="Obrigatório" />
      </>,
    );
    expect(await violacoesAxe(container)).toEqual([]);
  });
});
