import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Feedback, Tabs } from "../operations/List";
import { Check, Field } from "../operations/UI";
import { PhotoField } from "../components/Photo";
import { AVISO } from "./row";

// A configuração do condomínio é a única tela deste grupo que não é listagem:
// no original são abas de formulário, mais a página de parâmetros.
const PARAMETROS: [string, string, boolean][] = [
  ["Exigir foto do visitante", "Portaria", true],
  ["Exigir documento do visitante", "Portaria", true],
  ["Exigir objetivo da visita", "Portaria", true],
  ["Permitir visita sem autorização do morador", "Portaria", false],
  ["Limite de permanência do visitante", "Portaria", false],
  ["Avisar o morador na chegada da visita", "Portaria", true],
  ["Pré-autorização por link ou QR code", "Pré-autorização", true],
  ["Exigir CNH para prestador com veículo", "Pré-autorização", false],
  ["Quantidade máxima de convidados por unidade", "Pré-autorização", true],
  ["Horário permitido para convidados", "Pré-autorização", true],
  ["Fotografar a encomenda no recebimento", "Correspondências", true],
  ["Exigir assinatura na retirada", "Correspondências", false],
  ["Avisar pendências uma vez por dia", "Correspondências", true],
  ["Morador pode abrir ocorrência pelo app", "Comunicação", true],
  ["Ocorrência visível aos condôminos por padrão", "Comunicação", false],
  ["Comunicado exige confirmação de leitura", "Comunicação", true],
];

export default function Condominio() {
  const [params, setParams] = useSearchParams();
  const aba = params.get("tab") || "dados";
  const [aviso, setAviso] = useState("");
  const grupos = [...new Set(PARAMETROS.map((p) => p[1]))];
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Condomínio</h1>
        <button
          className="op-button primary"
          onClick={() =>
            setAviso("Esta prévia mostra os campos da configuração, mas ainda não grava.")
          }
        >
          Salvar
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Configuração do condomínio">
        <div className="op-panel-top">
          <Tabs
            tab={aba}
            options={[
              ["dados", "Dados gerais"],
              ["aparencia", "Aparência"],
              ["parametros", "Parâmetros"],
            ]}
            onSelect={(v) => setParams({ tab: v }, { replace: true })}
          />
        </div>
        <div className="op-form">
          {aba === "dados" && (
            <>
              <div className="op-form-grid">
                <Field label="Nome do condomínio" name="nome" value="Condomínio Modelo" />
                <Field label="CNPJ" name="cnpj" value="12.345.678/0001-90" />
                <Field label="Síndico responsável" name="sindico" value="Wagner Tavares" />
                <Field label="Telefone" name="telefone" value="(61) 3000-0000" />
                <Field
                  label="E-mail"
                  name="email"
                  type="email"
                  value="administracao@exemplo.com.br"
                />
                <Field
                  label="Endereço"
                  name="endereco"
                  value="Quadra 7, Conjunto B — Brasília/DF"
                />
                <Field label="Fuso horário" name="fuso" value="America/Sao_Paulo">
                  <option>America/Sao_Paulo</option>
                  <option>America/Manaus</option>
                  <option>America/Belem</option>
                </Field>
                <Field label="Nomenclatura das unidades" name="nomenclatura" value="Bloco e número">
                  <option>Bloco e número</option>
                  <option>Torre e apartamento</option>
                  <option>Casa</option>
                </Field>
              </div>
              <div className="op-section-label">Plano e cobrança</div>
              <div className="op-form-grid">
                <Field label="Plano" name="plano" value="Portaria remota — 20 unidades">
                  <option>Portaria remota — 20 unidades</option>
                  <option>Portaria remota — 50 unidades</option>
                  <option>Portaria presencial</option>
                </Field>
                <Field label="Vencimento" name="vencimento" value="10" />
              </div>
            </>
          )}
          {aba === "aparencia" && (
            <>
              <PhotoField label="Logo do condomínio" kind="objeto" />
              <div className="op-form-grid">
                <Field label="Cor do sistema" name="cor" value="Azul-escuro">
                  <option>Azul-escuro</option>
                  <option>Verde</option>
                  <option>Roxo</option>
                </Field>
                <Field label="Nome exibido no cabeçalho" name="exibido" value="Condomínio Modelo" />
              </div>
              <div className="op-checks">
                <Check label="Exibir telefone no cabeçalho" name="tel" checked />
                <Check label="Exibir logo da administradora" name="adm" checked={false} />
                <Check label="Permitir modo escuro" name="escuro" checked />
              </div>
            </>
          )}
          {aba === "parametros" && (
            <>
              <p className="op-hint">
                No sistema de referência esta página reúne mais de duzentos controles, que mudam o
                comportamento das demais telas. Aqui está uma amostra dos que afetam os módulos já
                construídos.
              </p>
              {grupos.map((grupo) => (
                <div key={grupo}>
                  <div className="op-section-label">{grupo}</div>
                  <div className="op-checks">
                    {PARAMETROS.filter((p) => p[1] === grupo).map(([rotulo, , ligado]) => (
                      <Check key={rotulo} label={rotulo} name={rotulo} checked={ligado} />
                    ))}
                  </div>
                </div>
              ))}
              <button className="op-button" onClick={() => setAviso(AVISO)}>
                Ver todos os parâmetros
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
