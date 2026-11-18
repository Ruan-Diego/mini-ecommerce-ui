import type { ButtonHTMLAttributes } from 'react';
import { cx } from './classes';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Filtro selecionado. Vira aria-pressed para o leitor de tela anunciar o estado. */
  ativo?: boolean;
}

/** Botão de filtro que liga e desliga (ex.: categorias na listagem). */
export function Chip({ ativo = false, className, type = 'button', ...resto }: ChipProps) {
  return <button type={type} aria-pressed={ativo} className={cx('chip', ativo && 'on', className)} {...resto} />;
}
