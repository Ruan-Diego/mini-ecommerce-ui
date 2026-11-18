import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';

export interface ModalProps {
  aberto: boolean;
  titulo: ReactNode;
  aoFechar: () => void;
  children: ReactNode;
  /** Nome acessível do botão de fechar. */
  rotuloFechar?: string;
}

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Diálogo modal acessível: role="dialog" com aria-modal e título; ao abrir, o foco vai para o diálogo
 * e, ao fechar, volta para quem abriu. Tab fica preso dentro dele; Esc e clique no fundo fecham.
 */
export function Modal({ aberto, titulo, aoFechar, children, rotuloFechar = 'Fechar' }: ModalProps) {
  const idTitulo = useId();
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    painel.current?.focus();
    return () => anterior?.focus();
  }, [aberto]);

  if (!aberto) return null;

  function aoTeclar(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Escape') {
      evento.stopPropagation();
      aoFechar();
      return;
    }
    if (evento.key !== 'Tab' || !painel.current) return;
    const focaveis = Array.from(painel.current.querySelectorAll<HTMLElement>(FOCAVEIS));
    if (focaveis.length === 0) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    const atual = document.activeElement;
    if (evento.shiftKey && (atual === primeiro || atual === painel.current)) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && atual === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  function aoClicarFundo(evento: MouseEvent<HTMLDivElement>) {
    if (evento.target === evento.currentTarget) aoFechar();
  }

  return (
    <div className="modal-bg" onMouseDown={aoClicarFundo}>
      <div
        ref={painel}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        onKeyDown={aoTeclar}
      >
        <div className="modal-hd">
          <h2 id={idTitulo} className="h3">
            {titulo}
          </h2>
          <button type="button" className="iconbtn" aria-label={rotuloFechar} onClick={aoFechar}>
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
