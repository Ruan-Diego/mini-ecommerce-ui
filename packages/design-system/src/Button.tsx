import type { ButtonHTMLAttributes } from 'react';

export type VarianteBotao = 'primario' | 'secundario' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao;
  pequeno?: boolean;
  bloco?: boolean;
}

const classes: Record<VarianteBotao, string> = {
  primario: 'btn-pri',
  secundario: 'btn-sec',
  ghost: 'btn-ghost',
};

/** Botão base. Os estilos vêm de tokens.css (classes .btn, .btn-pri, .btn-sec, .btn-ghost). */
export function Button({ variante = 'primario', pequeno, bloco, className, type = 'button', ...resto }: ButtonProps) {
  const cls = ['btn', classes[variante], pequeno && 'btn-sm', bloco && 'btn-block', className].filter(Boolean).join(' ');
  return <button type={type} className={cls} {...resto} />;
}
