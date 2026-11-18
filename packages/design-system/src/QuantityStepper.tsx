export interface QuantityStepperProps {
  valor: number;
  aoMudar: (novoValor: number) => void;
  min?: number;
  max?: number;
  /** Nome do grupo para o leitor de tela, ex.: "Quantidade de Esfera Chrome". */
  rotulo?: string;
}

/** Controle de quantidade com − e +. Os botões desabilitam nos limites; o valor é anunciado ao mudar. */
export function QuantityStepper({ valor, aoMudar, min = 1, max, rotulo = 'Quantidade' }: QuantityStepperProps) {
  const noMinimo = valor <= min;
  const noMaximo = max !== undefined && valor >= max;

  return (
    <div className="qty" role="group" aria-label={rotulo}>
      <button type="button" aria-label="Diminuir quantidade" disabled={noMinimo} onClick={() => aoMudar(valor - 1)}>
        −
      </button>
      <span aria-live="polite" aria-atomic="true">
        {valor}
      </span>
      <button type="button" aria-label="Aumentar quantidade" disabled={noMaximo} onClick={() => aoMudar(valor + 1)}>
        +
      </button>
    </div>
  );
}
