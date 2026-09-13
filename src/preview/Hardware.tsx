import { Icon } from "../components/Icons";

/**
 * Aviso das telas que só passam a funcionar com o equipamento conectado.
 * Fica explícito na apresentação: o cadastro está pronto e esperando a leitora.
 */
export function DependeDeEquipamento({ acoes }: { acoes: string }) {
  return (
    <div className="sh-hardware">
      <Icon name="chip" />
      <div>
        <strong>Esta tela depende de equipamento</strong>
        <span>
          O cadastro já está desenhado e pronto. {acoes} passam a funcionar quando o equipamento
          estiver conectado ao sistema.
        </span>
      </div>
    </div>
  );
}
