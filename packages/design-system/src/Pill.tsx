import type { HTMLAttributes } from 'react';
import { cx } from './classes';

export type TomPill = 'neutro' | 'destaque' | 'aviso' | 'erro' | 'sucesso';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tom?: TomPill;
}

const classes: Record<TomPill, string | undefined> = {
  neutro: undefined,
  destaque: 'pill-ac',
  aviso: 'pill-warn',
  erro: 'pill-bad',
  sucesso: 'pill-ok',
};

/** Etiqueta de status ou destaque (ex.: "Novo", "Pago", "Estoque baixo"). Não é interativa. */
export function Pill({ tom = 'neutro', className, ...resto }: PillProps) {
  return <span className={cx('pill', classes[tom], className)} {...resto} />;
}
