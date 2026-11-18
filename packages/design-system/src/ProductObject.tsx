import type { CSSProperties } from 'react';
import { cx } from './classes';

export type FormaObjeto = 'esfera' | 'anel' | 'capsula' | 'bloco';
export type MaterialObjeto = 'chrome' | 'lime' | 'clay' | 'ink' | 'amber' | 'iris';

export interface ProductObjectProps {
  forma?: FormaObjeto;
  material?: MaterialObjeto;
  /** Descrição para o leitor de tela. Sem rótulo, o objeto é decorativo e fica oculto (aria-hidden). */
  rotulo?: string;
  className?: string;
  style?: CSSProperties;
}

const classesForma: Record<FormaObjeto, string | undefined> = {
  esfera: undefined,
  anel: 'ring',
  capsula: 'capsule',
  bloco: 'block',
};

/** "Foto" do produto: objeto 3D feito só com CSS (gradientes radiais, máscara e sombra). */
export function ProductObject({ forma = 'esfera', material = 'chrome', rotulo, className, style }: ProductObjectProps) {
  const acessibilidade = rotulo ? { role: 'img', 'aria-label': rotulo } : { 'aria-hidden': true as const };
  return <div className={cx('obj', material, classesForma[forma], className)} style={style} {...acessibilidade} />;
}
