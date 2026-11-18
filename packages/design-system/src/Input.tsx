import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from './classes';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Texto do <label>. Obrigatório: todo campo precisa de um nome acessível. */
  label: ReactNode;
  /** Mensagem de erro; marca o campo como inválido e é anunciada pelo leitor de tela. */
  erro?: string;
}

/** Campo de texto com label associado (htmlFor/id) e mensagem de erro ligada por aria-describedby. */
export function Input({ label, erro, id, className, ...resto }: InputProps) {
  const idGerado = useId();
  const idCampo = id ?? idGerado;
  const idErro = `${idCampo}-erro`;

  return (
    <div className="field">
      <label htmlFor={idCampo}>{label}</label>
      <input
        {...resto}
        id={idCampo}
        className={cx('input', erro && 'err', className)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={cx(resto['aria-describedby'], erro && idErro) || undefined}
      />
      {erro && (
        <span id={idErro} className="hint-err">
          {erro}
        </span>
      )}
    </div>
  );
}
