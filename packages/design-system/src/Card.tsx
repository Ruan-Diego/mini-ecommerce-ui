import type { HTMLAttributes } from 'react';
import { cx } from './classes';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Elemento usado; prefira section/article quando o card tiver título próprio. */
  como?: 'div' | 'section' | 'article' | 'aside';
}

/** Superfície elevada (fundo --s1, borda e raio grande). */
export function Card({ como: Tag = 'div', className, ...resto }: CardProps) {
  return <Tag className={cx('card', className)} {...resto} />;
}
